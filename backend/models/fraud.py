def analyze_fraud(description, claimed_amount):
    score = 0

    if "stolen" in description.lower():
        score += 30

    if claimed_amount > 500000:
        score += 40

    return {
        "fraud_probability": min(score, 95),
        "indicators": [
            "Suspicious claim keywords detected",
            "High claimed amount" if claimed_amount > 500000 else ""
        ]
    }
