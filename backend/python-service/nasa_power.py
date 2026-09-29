"""
Real, live climate/satellite-derived data via NASA POWER API.
NASA POWER is a free, public API - no signup or API key required.
Docs: https://power.larc.nasa.gov/docs/services/api/

This is genuinely real data: for a given latitude/longitude it returns
actual satellite/reanalysis-derived climate values - not mock numbers.

Note: requires outbound internet access to power.larc.nasa.gov.
"""

import requests

POWER_URL = "https://power.larc.nasa.gov/api/temporal/climatology/point"


def fetch_climate_indicators(lat: float, lon: float) -> dict:
    """
    Returns real climatology-averaged values for a coordinate:
    - PRECTOTCORR: precipitation (mm/day), corrected
    - T2M: temperature at 2m (°C)
    - GWETROOT: root zone soil wetness (0-1), used as a soil moisture proxy
    These are derived from NASA's satellite and reanalysis data products.
    """
    params = {
        "parameters": "PRECTOTCORR,T2M,GWETROOT",
        "community": "AG",
        "longitude": lon,
        "latitude": lat,
        "format": "JSON",
    }

    resp = requests.get(POWER_URL, params=params, timeout=15)
    resp.raise_for_status()
    data = resp.json()

    params_data = data["properties"]["parameter"]

    def annual_avg(series: dict) -> float:
        # NASA POWER climatology returns monthly keys (JAN..DEC) plus "ANN" (annual average)
        return round(series.get("ANN", sum(series.values()) / len(series)), 3)

    return {
        "rainfallMmPerDay": annual_avg(params_data["PRECTOTCORR"]),
        "landSurfaceTempC": annual_avg(params_data["T2M"]),
        "rootZoneSoilWetness": annual_avg(params_data["GWETROOT"]),
        "source": "NASA POWER API (live)",
    }
