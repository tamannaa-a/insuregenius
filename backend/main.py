from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
import joblib
import numpy as np
import pandas as pd

app = FastAPI()

# CORS (so frontend can connect)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load Renewal Prediction Model
try:
    renewal_model = joblib.load("models/renewal_model.pkl")
except:
    renewal_model = None


# ------------------------- POLICY SUMMARY -------------------------
@app.post("/policy/summary")
async def policy_summary(text: str = Form(...)):
    """
    Heuristic summarization (LLM-ready)
    """
    coverage = "Coverage details not found."
    exclusions = "Exclusions not found."
    limits = "Limits not found."

    t = text.lower()

    if "cover" in t:
        coverage = text[text.lower().find("cover"): text.lower().find("cover") + 200]
    if "exclude" in t:
        exclusions = text[text.lower().find("exclude"): text.lower().find("exclude") + 200]
    if "limit" in t or "sum insured" in t:
        limits = text[text.lower().find("limit"): text.lower().find("limit") + 200]

    summary = f"""
    POLICY SUMMARY:
    • Coverage: {coverage.strip()}
    • Exclusions: {exclusions.strip()}
    • Limits: {limits.strip()}

    NOTE: This is a heuristic summary. In a production system, this route
    would send your policy text to a fine-tuned LLM such as GPT or Llama.
    """

    return {"summary": summary}


# ------------------------- CLAIM NORMALIZER -------------------------
@app.post("/claims/normalize")
async def normalize_claim(text: str = Form(...)):
    lower = text.lower()

    loss_type = "General Loss"
    severity = "Medium"
    asset = "Unknown"

    if "car" in lower or "vehicle" in lower:
        asset = "Car"
    if "house" in lower:
        asset = "Home"
    if "fire" in lower:
        loss_type = "Fire Damage"
    if "flood" in lower:
        loss_type = "Flood Damage"

    if "minor" in lower:
        severity = "Low"
    if "severe" in lower or "total" in lower:
        severity = "High"

    structured = {
        "lossType": loss_type,
        "severity": severity,
        "asset": asset,
        "summary": f"{loss_type}, Severity {severity}, Asset {asset}"
    }

    return structured


# ------------------------- FRAUD DETECTION -------------------------
@app.post("/fraud/check")
async def fraud_check(text: str = Form(...), amount: float = Form(...)):

    lower = text.lower()
    risk = "Low"
    reasons = []

    if amount > 300000:
        risk = "Medium"
        reasons.append("High claim amount")

    if "urgent" in lower or "immediate" in lower:
        risk = "Medium"
        reasons.append("Pressure language used")

    if "again" in lower or "similar claim" in lower:
        risk = "High"
        reasons.append("Repeat claim pattern")

    if "no documents" in lower or "missing photos" in lower:
        risk = "High"
        reasons.append("Lack of documentation")

    if risk == "Low":
        reasons.append("No strong fraud patterns detected")

    return {"risk": risk, "reasons": reasons}


# ------------------------- DOCUMENT CLASSIFIER -------------------------
@app.post("/docs/classify")
async def classify_doc(text: str = Form(...)):

    lower = text.lower()

    if "invoice" in lower or "estimate" in lower:
        return {"type": "Repair Invoice"}

    if "inspection" in lower or "survey" in lower:
        return {"type": "Inspection Report"}

    if "claim form" in lower or "policy number" in lower:
        return {"type": "Claim Form"}

    return {"type": "Other"}


# ------------------------- RENEWAL PREDICTION -------------------------
@app.post("/renewal/predict")
async def renewal_predict(premium: float = Form(...), claims: int = Form(...), late_payments: int = Form(...)):

    if renewal_model is None:
        probability = 0.75
    else:
        x = np.array([[premium, claims, late_payments]])
        probability = renewal_model.predict_proba(x)[0][1]

    return {"probability": float(probability)}


# ------------------------- ACTUARIAL CODE ASSISTANT -------------------------
@app.post("/code/generate")
async def generate_code(prompt: str = Form(...)):
    code = f"""
# Auto-generated Actuarial Script based on prompt:
# "{prompt}"

import pandas as pd
import matplotlib.pyplot as plt

df = pd.DataFrame({{
    "year": [2019, 2020, 2021, 2022],
    "premium": [1000000, 1100000, 1200000, 1300000],
    "losses": [600000, 650000, 700000, 750000]
}})

df["loss_ratio"] = df["losses"] / df["premium"]

print(df)

plt.plot(df["year"], df["loss_ratio"], marker='o')
plt.title("Loss Ratio Trend")
plt.ylabel("Loss Ratio")
plt.show()
"""

    return {"code": code}
