import jwt
from datetime import datetime, timedelta

SECRET = "CLAIMAXIS_SECRET"

def create_token(email: str):
    payload = {
        "email": email,
        "exp": datetime.utcnow() + timedelta(hours=24)
    }
    return jwt.encode(payload, SECRET, algorithm="HS256")

def verify_token(token: str):
    try:
        return jwt.decode(token, SECRET, algorithms=["HS256"])
    except:
        return None
