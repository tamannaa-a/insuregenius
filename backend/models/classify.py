def classify_document(text):
    text_l = text.lower()

    if "accident" in text_l:
        return {"type": "Motor Claim", "confidence": 0.89}

    if "hospital" in text_l or "treatment" in text_l:
        return {"type": "Health Claim", "confidence": 0.92}

    return {"type": "Unknown Document", "confidence": 0.50}
