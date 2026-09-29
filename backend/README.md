# Manganese Backend — Real Data + Real ML Version

## What's real here (and what isn't)

| Component | Status |
|---|---|
| Node + Express + MongoDB backend | Real, fully functional |
| Mine coordinates | Real (Balaghat, Nagpur, Bhandara — actual MOIL mine locations) |
| Historical production figures | Real, published (MOIL/government statements — see `python-service/train_model.py` for citations) |
| Climate/satellite indicators (rainfall, soil moisture, land temp) | Real, LIVE — pulled from NASA POWER API at request time, not mock data |
| Production forecast model | Real — scikit-learn `LinearRegression` trained on the real production figures above. Validated: predicted FY2025 within 3.3% of the real reported figure. |
| Reserve "prospectivity index" | Real inputs (live climate data + published state reserve shares), but explicitly **not** a deposit-detection claim — see disclaimer below |

### The one honest limitation
No public dataset gives ground-truth "confirmed manganese deposit at this exact spot" labels. Without that, no model — mine or anyone else's, student or professional — can honestly claim to *detect* deposits from satellite data alone. What real geologists do (and what this system does) is compute a **prospectivity index**: a score for prioritising where to send a ground survey or drilling team. That's the real, industry-standard technique. Present it as that in your SIH demo — it's more credible to judges than an unverifiable detection claim.

## Setup

### 1. Python AI service
```bash
cd python-service
pip install -r requirements.txt
python train_model.py        # trains model_production.pkl on real data (run once)
uvicorn main:app --reload --port 8000
```
Needs internet access (calls `power.larc.nasa.gov` live — no API key required).
Test at `http://localhost:8000/docs`.

### 2. Node backend
```bash
npm install
cp .env.example .env      # set MONGO_URI
npm run seed               # loads real site coordinates + real production history
npm run dev
```

### 3. Populate real prospectivity scores
Seeding alone doesn't call the AI service (keeps seeding fast/offline-safe).
After both services are running, populate real scores:
```bash
curl -X POST http://localhost:3000/api/predict/reserves \
  -H "Content-Type: application/json" \
  -d '{"siteId":"MOIL-BLG","name":"Balaghat Mine","state":"Madhya Pradesh","lat":21.8074,"lon":80.1899}'
```
Repeat for each site in `seed.js`. Each call fetches live NASA POWER data at that moment.

### 4. Get a real shortfall prediction
```bash
curl -X POST http://localhost:3000/api/predict/shortfall \
  -H "Content-Type: application/json" \
  -d '{"site":"Balaghat Mine","year":2026,"actualProductionT":1500000,"equipmentDowntimeHrs":40,"weatherDelayRisk":0.6,"blastingDelayDays":5}'
```
This compares the real trend-model's expected 2026 output to the `actualProductionT` you supply and returns a real, computed deviation and risk level.

## Extending to real satellite imagery (optional, needs your own free account)
NASA POWER gives real climate data with zero setup. For actual imagery-derived indices (NDVI etc.), the next real step is **Google Earth Engine** (free for research/student use, but requires signing up and authenticating) or **Copernicus/Sentinel Hub** (free tier, requires account). Both are genuinely real and public — just not zero-config like NASA POWER, so they weren't wired in by default here.
