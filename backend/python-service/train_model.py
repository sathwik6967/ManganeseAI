"""
Trains a REAL scikit-learn model on REAL, publicly published MOIL production
figures (sourced from company/government statements, cited below). This is a
genuinely small dataset - that's an honest limitation of public data
availability, not something to hide. The model learns the actual production
trend and is used to flag when a reported/actual figure falls meaningfully
below what the trend would predict (= shortfall signal).

Sources (as of Sep 2026 search):
- FY2015-16 annual production: 1,093,363 t
  (Business Standard, "MOIL manganese output at 7.45 lakh tonnes in Apr-Dec", Mar 2016)
- FY2023-24 annual production: 1,750,000 t (up 34.61% YoY)
  (SteelOrbis, "MOIL Limited achieves 35% rise in manganese ore output in FY 2023-24")
- FY2024-25, Apr-Sep (H1): 870,000 t
  (Business Standard, "MOIL gains on achieving best ever production in Sep'24")
- FY2024-25, Apr-Dec (9 months): 1,330,000 t, +4.5% YoY
  (PSU Watch, "MOIL's manganese ore production rises 5% in Apr-Dec 2024")

Run: python train_model.py   (writes model_production.pkl)
"""

import numpy as np
from sklearn.linear_model import LinearRegression
import joblib

# fiscal year (end year) -> annual production in tonnes.
# Only years with a confirmed full-year published figure are used to train.
YEARS = np.array([2016, 2024]).reshape(-1, 1)
PRODUCTION_T = np.array([1093363, 1750000])

# FY2024-25 9-month figure, annualised for reference/validation (NOT used in training
# since it's a projection, not a confirmed full-year figure):
FY2025_9MO_T = 1330000
FY2025_ANNUALISED_T = round(FY2025_9MO_T / 9 * 12)  # ~1,773,333 t


def train_and_save():
    model = LinearRegression()
    model.fit(YEARS, PRODUCTION_T)

    joblib.dump(model, "model_production.pkl")

    print("Model trained on real MOIL annual production figures:")
    for y, p in zip(YEARS.flatten(), PRODUCTION_T):
        print(f"  FY ending {y}: {p:,} t (actual, published)")
    print(f"  FY ending 2025 (annualised estimate from 9-month data): {FY2025_ANNUALISED_T:,} t")
    print(f"Model coefficient (t/year): {model.coef_[0]:.1f}")
    print(f"Model intercept: {model.intercept_:.1f}")
    print("Saved to model_production.pkl")


if __name__ == "__main__":
    train_and_save()
