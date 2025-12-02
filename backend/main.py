from fastapi import FastAPI, Form
from fastapi.middleware.cors import CORSMiddleware
import joblib
import numpy as np

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

try:
    renewal_model = joblib.load("models/renewal_model.pkl")
except:
    renewal_model = None


# ================= POLICY SUMMARY =================
@app.post("/policy/summary")
async def policy_summary(text: str = Form(...)):
    t = text.lower()

    coverage = text[text.lower().find("cover"): text.lower().find("cover") + 200] if "cover" in t else "Coverage not found"
    exclusions = text[text.lower().find("exclude"): text.lower().find("exclude") + 200] if "exclude" in t else "Exclusions not found"
    limits = text[text.lower().find("limit"): text.lower().find("limit") + 200] if "limit" in t else "Limits not found"

    return {
        "summary": f"""
Policy Summary:
• Coverage: {coverage}
• Exclusions: {exclusions}
• Limits: {limits}

(LLM-ready endpoint — plug GPT here)
"""
    }


# ================= CLAIM NORMALIZATION =================
@app.post("/claims/normalize")
async def normalize_claim(text: str = Form(...)):
    lower = text.lower()

    loss_type = "General Loss"
    severity = "Medium"
    asset = "Unknown"

    if "car" in lower:
        asset = "Car"
    if "house" in lower:
        asset = "House"
    if "flood" in lower:
        loss_type = "Flood Damage"
    if "fire" in lower:
        loss_type = "Fire Damage"

    if "minor" in lower:
        severity = "Low"
    if "severe" in lower or "total" in lower:
        severity = "High"

    return {
        "lossType": loss_type,
        "severity": severity,
        "asset": asset,
        "summary": f"{loss_type} | Severity {severity} | Asset {asset}"
    }


# ================= FRAUD DETECTOR =================
@app.post("/fraud/check")
async def fraud_check(text: str = Form(...), amount: float = Form(...)):
    lower = text.lower()

    risk = "Low"
    reasons = []

    if amount > 300000:
        risk = "Medium"
        reasons.append("High claim amount")

    if "urgent" in lower:
        risk = "Medium"
        reasons.append("Pressure wording")

    if "again" in lower:
        risk = "High"
        reasons.append("Repeat claim pattern")

    if len(reasons) == 0:
        reasons.append("No fraud indicators detected")

    return {"risk": risk, "reasons": reasons}


# ================= DOCUMENT CLASSIFICATION =================
@app.post("/docs/classify")
async def classify_doc(text: str = Form(...)):
    lower = text.lower()

    if "invoice" in lower:
        return {"type": "Repair Invoice"}
    if "inspection" in lower:
        return {"type": "Inspection Report"}
    if "claim" in lower:
        return {"type": "Claim Form"}

    return {"type": "Other"}


# ================= RENEWAL PREDICTION =================
@app.post("/renewal/predict")
async def predict_renewal(premium: float = Form(...), claims: int = Form(...), late: int = Form(...)):

    if renewal_model is None:
        return {"probability": 0.78}

    x = np.array([[premium, claims, late]])
    prob = renewal_model.predict_proba(x)[0][1]

    return {"probability": float(prob)}


# ================= ACTUARIAL CODE GENERATOR =================
@app.post("/code/generate")
async def generate_code(prompt: str = Form(...)):

    python_code = f"""
# Auto-generated script
# Prompt: {prompt}

import pandas as pd
import matplotlib.pyplot as plt

df = pd.DataFrame({{
 'year': [2019,2020,2021,2022],
 'premium':[1000000,1100000,1200000,1300000],
 'losses':[600000,650000,700000,750000]
}})

df['loss_ratio'] = df['losses']/df['premium']
print(df)

plt.plot(df['year'], df['loss_ratio'], marker='o')
plt.title("Loss Ratio Trend")
plt.show()
    """

    return {"code": python_code}
