import pandas as pd
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
import joblib

# ---------------------------
# 1. Create synthetic training dataset
# ---------------------------

data = {
    "premium": [10000, 12000, 15000, 9000, 14000, 8000, 11000, 20000, 22000, 16000,
                13000, 17000, 12500, 13500, 14500, 15500, 16500, 17500, 18500, 19500],

    "claims": [0, 1, 2, 3, 0, 4, 1, 0, 0, 3,
               2, 1, 0, 1, 2, 2, 3, 1, 0, 4],

    "late_payments": [0, 2, 3, 5, 0, 4, 2, 0, 1, 3,
                      2, 1, 0, 2, 3, 2, 4, 1, 0, 5],

    # 1 = renewed, 0 = churn
    "renewed": [1, 1, 0, 0, 1, 0, 1, 1, 1, 0,
                1, 1, 1, 1, 0, 0, 0, 1, 1, 0]
}

df = pd.DataFrame(data)

X = df[["premium", "claims", "late_payments"]]
y = df["renewed"]

# ---------------------------
# 2. Create ML pipeline
# ---------------------------

pipeline = Pipeline([
    ("scaler", StandardScaler()),
    ("model", LogisticRegression())
])

# ---------------------------
# 3. Train-test split
# ---------------------------

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

pipeline.fit(X_train, y_train)

accuracy = pipeline.score(X_test, y_test)
print(f"Model trained successfully! Accuracy: {accuracy * 100:.2f}%")

# ---------------------------
# 4. Save model
# ---------------------------

joblib.dump(pipeline, "renewal_model.pkl")

print("renewal_model.pkl saved in backend/models/")
