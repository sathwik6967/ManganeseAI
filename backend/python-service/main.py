"""
Real AI service for the manganese SIH project.

- /predict-reserves  -> calls live NASA POWER API for real climate indicators
                         at the given coordinates, combines them with published
                         geological reserve-share data into a "prospectivity
                         index". This is the honest, real technique (mineral
                         prospectivity mapping) - it is a probability/priority
                         score for further ground survey, NOT a claim of
                         confirmed deposit detection. No such claim is possible
                         from public data, and real geologists don't make it
                         either - they use this kind of score to decide where
                         to send a drilling team.

- /predict-shortfall -> uses model_production.pkl (trained on real MOIL
                         production figures, see train_model.py) to compute
                         the expected production trend, then compares it to
                         the actual/reported figure supplied in the request
                         to flag a shortfall risk.

Run:
    pip install -r requirements.txt
    python train_model.py        # trains model_production.pkl once
    uvicorn main:app --reload --port 8000
"""

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import joblib
import os

from nasa_power import fetch_climate_indicators

app = FastAPI(title="Manganese AI Service (real data)")

MODEL_PATH = "model_production.pkl"
_model = None

# Published geological reserve share by state (Indian Bureau of Mines /
# National Mineral Inventory, as reported via GSI-derived summaries).
# Used as the geological-belt weighting in the prospectivity index.
STATE_RESERVE_SHARE = {
    "Odisha": 0.44,
    "Madhya Pradesh": 0.33,
    "Maharashtra": 0.248,
    "Karnataka": 0.115,
    "Andhra Pradesh": 0.02,
    "Jharkhand": 0.02,
}


def get_model():
    global _model
    if _model is None:
        if not os.path.exists(MODEL_PATH):
            raise RuntimeError("model_production.pkl not found - run train_model.py first")
        _model = joblib.load(MODEL_PATH)
    return _model


class ReserveInput(BaseModel):
    siteId: str
    name: str
    state: str
    lat: float
    lon: float


class ReserveOutput(BaseModel):
    siteId: str
    name: str
    state: str
    prospectivityIndex: int   # 0-100, NOT a confirmed-deposit probability
    status: str
    indicators: dict
    dataSource: str
    disclaimer: str


class ShortfallInput(BaseModel):
    site: str
    year: int              # e.g. 2026 - the fiscal year being evaluated
    actualProductionT: float  # actual/reported production so far, in tonnes
    equipmentDowntimeHrs: float = 0
    weatherDelayRisk: float = 0  # 0-1, from real rainfall data ideally
    blastingDelayDays: int = 0


class ShortfallOutput(BaseModel):
    site: str
    expectedProductionT: float
    actualProductionT: float
    deviationPct: float
    issue: str
    severity: str
    eta: str


@app.get("/")
def health():
    return {"status": "ok", "service": "manganese-ai-real"}


@app.post("/predict-reserves", response_model=ReserveOutput)
def predict_reserves(payload: ReserveInput):
    try:
        climate = fetch_climate_indicators(payload.lat, payload.lon)
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"NASA POWER API call failed: {e}")

    geo_weight = STATE_RESERVE_SHARE.get(payload.state, 0.05)

    # Prospectivity index: geological belt weight is the dominant real signal
    # (this is the actual established indicator in Indian manganese geology);
    # climate indicators are added as a minor modifier since manganese-bearing
    # laterite/gondite zones correlate loosely with specific moisture/vegetation
    # regimes used in real prospectivity mapping literature.
    climate_modifier = (
        climate["rootZoneSoilWetness"] * 15
        + max(0, 10 - abs(climate["landSurfaceTempC"] - 27))
    )
    raw_score = geo_weight * 100 * 0.75 + climate_modifier
    index = max(5, min(97, round(raw_score)))
    status = "high" if index >= 65 else "medium" if index >= 35 else "low"

    return ReserveOutput(
        siteId=payload.siteId,
        name=payload.name,
        state=payload.state,
        prospectivityIndex=index,
        status=status,
        indicators=climate,
        dataSource="NASA POWER (live climate data) + IBM/GSI published state reserve shares",
        disclaimer=(
            "This is a prospectivity index for prioritising ground survey/drilling, "
            "not a confirmed deposit detection. No public dataset provides ground-truth "
            "assay labels needed for a verified detection model."
        ),
    )


@app.post("/predict-shortfall", response_model=ShortfallOutput)
def predict_shortfall(payload: ShortfallInput):
    model = get_model()
    expected = float(model.predict([[payload.year]])[0])

    deviation_pct = round((payload.actualProductionT - expected) / expected * 100, 1)

    operational_risk = (
        payload.equipmentDowntimeHrs * 0.5
        + payload.weatherDelayRisk * 40
        + payload.blastingDelayDays * 3
    )

    if deviation_pct < -15 or operational_risk > 45:
        severity, eta, issue = "high", "3 days", "Actual production trailing trend significantly; operational factors compounding risk"
    elif deviation_pct < -5 or operational_risk > 20:
        severity, eta, issue = "medium", "9 days", "Production below expected trend; monitor equipment/weather factors"
    else:
        severity, eta, issue = "low", "—", "Production tracking in line with expected trend"

    return ShortfallOutput(
        site=payload.site,
        expectedProductionT=round(expected, 1),
        actualProductionT=payload.actualProductionT,
        deviationPct=deviation_pct,
        issue=issue,
        severity=severity,
        eta=eta,
    )
