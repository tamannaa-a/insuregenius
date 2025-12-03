from datetime import datetime, timedelta
import os
import uuid
from typing import Optional, List

from fastapi import FastAPI, Form, Depends, HTTPException, status, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from passlib.context import CryptContext
from pydantic import BaseModel
from sqlalchemy import (
    create_engine,
    Column,
    Integer,
    String,
    Boolean,
    ForeignKey,
    DateTime,
    Float,
    Text,
)
from sqlalchemy.orm import sessionmaker, declarative_base, relationship, Session
import joblib
import numpy as np

# -------------------------------
# CONFIG
# -------------------------------
DATABASE_URL = "sqlite:///./saas.db"
SECRET_KEY = "super-secret-key-change-me-in-production"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

# -------------------------------
# DB SETUP
# -------------------------------
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)
Base = declarative_base()

# -------------------------------
# MODELS
# -------------------------------

class Tenant(Base):
    __tablename__ = "tenants"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    api_key = Column(String, unique=True, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    users = relationship("User", back_populates="tenant")


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    role = Column(String, default="customer")  # admin / underwriter / agent / customer
    tenant_id = Column(Integer, ForeignKey("tenants.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
    is_active = Column(Boolean, default=True)

    tenant = relationship("Tenant", back_populates="users")


class PaymentRecord(Base):
    __tablename__ = "payments"
    id = Column(Integer, primary_key=True, index=True)
    tenant_id = Column(Integer, ForeignKey("tenants.id"))
    amount = Column(Float)
    currency = Column(String, default="INR")
    status = Column(String, default="pending")  # pending / success / failed
    created_at = Column(DateTime, default=datetime.utcnow)


Base.metadata.create_all(bind=engine)

# -------------------------------
# AUTH HELPERS
# -------------------------------
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def verify_password(plain, hashed):
    return pwd_context.verify(plain, hashed)


def hash_password(pw):
    return pwd_context.hash(pw)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=15))
    to_encode.update({"exp": expire})
    encoded = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded


def get_user_by_email(db: Session, email: str) -> Optional[User]:
    return db.query(User).filter(User.email == email).first()


def get_tenant_by_name(db: Session, name: str) -> Optional[Tenant]:
    return db.query(Tenant).filter(Tenant.name == name).first()


def create_tenant(db: Session, name: str) -> Tenant:
    tenant = Tenant(name=name, api_key=str(uuid.uuid4()))
    db.add(tenant)
    db.commit()
    db.refresh(tenant)
    return tenant


def create_user(db: Session, email: str, password: str, role: str, tenant: Tenant) -> User:
    user = User(
        email=email,
        hashed_password=hash_password(password),
        role=role,
        tenant_id=tenant.id,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


class TokenData(BaseModel):
    sub: Optional[str] = None
    tenant_id: Optional[int] = None
    role: Optional[str] = None


async def get_current_user(
    token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)
) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate token",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        tenant_id: int = payload.get("tenant_id")
        role: str = payload.get("role")
        if email is None or tenant_id is None:
            raise credentials_exception
        token_data = TokenData(sub=email, tenant_id=tenant_id, role=role)
    except JWTError:
        raise credentials_exception
    user = get_user_by_email(db, token_data.sub)
    if user is None or user.tenant_id != token_data.tenant_id:
        raise credentials_exception
    return user


def require_role(allowed_roles: List[str]):
    def _role_dep(user: User = Depends(get_current_user)):
        if user.role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Insufficient role permissions",
            )
        return user

    return _role_dep


# -------------------------------
# Pydantic Schemas
# -------------------------------
class UserOut(BaseModel):
    id: int
    email: str
    role: str
    tenant_name: str

    class Config:
        orm_mode = True


class TenantOut(BaseModel):
    id: int
    name: str
    api_key: str

    class Config:
        orm_mode = True


class PaymentOut(BaseModel):
    id: int
    amount: float
    currency: str
    status: str
    created_at: datetime

    class Config:
        orm_mode = True


# -------------------------------
# APP INIT
# -------------------------------
app = FastAPI(title="InsureGenius SaaS Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Try load renewal model if exists
try:
    renewal_model = joblib.load("models/renewal_model.pkl")
except Exception:
    renewal_model = None

# Ensure storage folder exists (for "cloud" uploads)
os.makedirs("storage", exist_ok=True)


# -------------------------------
# AUTH & TENANCY ENDPOINTS
# -------------------------------
@app.post("/auth/register", response_model=UserOut)
def register_user(
    email: str = Form(...),
    password: str = Form(...),
    tenant_name: str = Form(...),
    role: str = Form("customer"),
    db: Session = Depends(get_db),
):
    existing = get_user_by_email(db, email)
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    tenant = get_tenant_by_name(db, tenant_name)
    if tenant is None:
        tenant = create_tenant(db, tenant_name)

    user = create_user(db, email, password, role, tenant)
    return UserOut(id=user.id, email=user.email, role=user.role, tenant_name=tenant.name)


@app.post("/auth/login")
def login(
    form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)
):
    user = get_user_by_email(db, form_data.username)
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect username or password")

    tenant = db.query(Tenant).filter(Tenant.id == user.tenant_id).first()
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    token = create_access_token(
        data={"sub": user.email, "tenant_id": user.tenant_id, "role": user.role},
        expires_delta=access_token_expires,
    )
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "email": user.email,
            "role": user.role,
            "tenant_name": tenant.name if tenant else "",
        },
    }


@app.get("/auth/me", response_model=UserOut)
def get_me(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    tenant = db.query(Tenant).filter(Tenant.id == user.tenant_id).first()
    return UserOut(id=user.id, email=user.email, role=user.role, tenant_name=tenant.name)


@app.get("/tenants/me", response_model=TenantOut)
def get_my_tenant(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    tenant = db.query(Tenant).filter(Tenant.id == user.tenant_id).first()
    if not tenant:
        raise HTTPException(status_code=404, detail="Tenant not found")
    return tenant


@app.post("/tenants/regenerate-api-key", response_model=TenantOut)
def regenerate_api_key(
    user: User = Depends(require_role(["admin"])), db: Session = Depends(get_db)
):
    tenant = db.query(Tenant).filter(Tenant.id == user.tenant_id).first()
    if not tenant:
        raise HTTPException(status_code=404, detail="Tenant not found")
    tenant.api_key = str(uuid.uuid4())
    db.commit()
    db.refresh(tenant)
    return tenant


# -------------------------------
# PAYMENT STUB (FAKE GATEWAY)
# -------------------------------
@app.post("/billing/checkout", response_model=PaymentOut)
def checkout(
    amount: float = Form(...),
    currency: str = Form("INR"),
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    payment = PaymentRecord(
        tenant_id=user.tenant_id, amount=amount, currency=currency, status="success"
    )
    db.add(payment)
    db.commit()
    db.refresh(payment)
    return payment


@app.get("/billing/history", response_model=list[PaymentOut])
def payment_history(
    user: User = Depends(get_current_user), db: Session = Depends(get_db)
):
    qs = db.query(PaymentRecord).filter(PaymentRecord.tenant_id == user.tenant_id).all()
    return qs


# -------------------------------
# SIMPLE "CLOUD" STORAGE (LOCAL)
# -------------------------------
@app.post("/storage/upload")
async def upload_document(
    file: UploadFile = File(...),
    user: User = Depends(get_current_user),
):
    ext = os.path.splitext(file.filename)[1]
    unique_name = f"{user.tenant_id}_{uuid.uuid4()}{ext}"
    dest_path = os.path.join("storage", unique_name)

    with open(dest_path, "wb") as f:
        content = await file.read()
        f.write(content)

    return {
        "filename": file.filename,
        "stored_as": unique_name,
        "url": f"/storage/{unique_name}",
    }


# -------------------------------
# AI ENDPOINTS (reusing your logic)
# All require login (multi-tenant protected)
# -------------------------------
@app.post("/policy/summary")
async def policy_summary(
    text: str = Form(...),
    user: User = Depends(get_current_user),
):
    t = text.lower()

    coverage = (
        text[t.find("cover") : t.find("cover") + 200] if "cover" in t else "Coverage not found"
    )
    exclusions = (
        text[t.find("exclude") : t.find("exclude") + 200]
        if "exclude" in t
        else "Exclusions not found"
    )
    limits = (
        text[t.find("limit") : t.find("limit") + 200]
        if "limit" in t
        else "Limits not found"
    )

    summary = f"""Policy Summary:
• Coverage: {coverage.strip()}
• Exclusions: {exclusions.strip()}
• Limits: {limits.strip()}

(LLM-ready endpoint — in production, send policy text to a fine-tuned LLM here.)
"""

    return {"summary": summary}


@app.post("/claims/normalize")
async def normalize_claim(
    text: str = Form(...),
    user: User = Depends(get_current_user),
):
    lower = text.lower()

    loss_type = "General Loss"
    severity = "Medium"
    asset = "Unknown"

    if "car" in lower or "vehicle" in lower:
        asset = "Car"
    if "house" in lower or "home" in lower:
        asset = "House"
    if "flood" in lower or "water" in lower:
        loss_type = "Flood Damage"
    if "fire" in lower:
        loss_type = "Fire Damage"

    if "minor" in lower or "scratch" in lower:
        severity = "Low"
    if "severe" in lower or "total loss" in lower or "heavily" in lower:
        severity = "High"

    return {
        "lossType": loss_type,
        "severity": severity,
        "asset": asset,
        "summary": f"{loss_type} | Severity {severity} | Asset {asset}",
    }


@app.post("/fraud/check")
async def fraud_check(
    text: str = Form(...),
    amount: float = Form(...),
    user: User = Depends(get_current_user),
):
    lower = text.lower()

    risk = "Low"
    reasons = []

    if amount > 300000:
        risk = "Medium"
        reasons.append("High claim amount compared to typical personal lines claims.")

    if "urgent" in lower or "immediate" in lower or "asap" in lower:
        risk = "Medium"
        reasons.append("Pressure wording used in claim narrative.")

    if "again" in lower or "similar claim" in lower or "repeated" in lower:
        risk = "High"
        reasons.append("Repeat claim pattern mentioned in description.")

    if "no documents" in lower or "missing photos" in lower or "cannot provide" in lower:
        risk = "High"
        reasons.append("Lack of documentation / evidence for the claim.")

    if not reasons:
        reasons.append("No strong fraud indicators detected based on simple rules.")

    return {"risk": risk, "reasons": reasons}


@app.post("/docs/classify")
async def classify_doc(
    text: str = Form(...),
    user: User = Depends(get_current_user),
):
    lower = text.lower()

    if "invoice" in lower or "estimate" in lower or "bill" in lower:
        return {"type": "Repair Invoice"}
    if "inspection" in lower or "survey" in lower or "assessor" in lower:
        return {"type": "Inspection Report"}
    if "claim form" in lower or "policy number" in lower or "claim number" in lower:
        return {"type": "Claim Form"}
    if "proposal form" in lower or "application" in lower:
        return {"type": "Proposal / Application"}

    return {"type": "Other"}


@app.post("/renewal/predict")
async def predict_renewal(
    premium: float = Form(...),
    claims: int = Form(...),
    late: int = Form(...),
    user: User = Depends(get_current_user),
):
    if renewal_model is None:
        return {"probability": 0.78}
    x = np.array([[premium, claims, late]])
    prob = renewal_model.predict_proba(x)[0][1]
    return {"probability": float(prob)}


@app.post("/code/generate")
async def generate_code(
    prompt: str = Form(...),
    user: User = Depends(get_current_user),
):
    python_code = f"""# Auto-generated actuarial analysis script
# Prompt: {prompt}

import pandas as pd
import matplotlib.pyplot as plt

df = pd.DataFrame({{
    "year": [2019, 2020, 2021, 2022],
    "earned_premium": [1000000, 1100000, 1200000, 1300000],
    "incurred_losses": [600000, 650000, 700000, 750000]
}})

df["loss_ratio"] = df["incurred_losses"] / df["earned_premium"]
print(df)

plt.plot(df["year"], df["loss_ratio"], marker="o")
plt.xlabel("Year")
plt.ylabel("Loss Ratio")
plt.title("Loss Ratio Trend")
plt.axhline(1.0, linestyle="--")  # 100% line
plt.show()
"""

    return {"code": python_code}
