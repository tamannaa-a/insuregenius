import pandas as pd
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
import joblib

# Simple synthetic dataset
data = {
    "premium": [10000, 12000, 15000, 9000, 14000, 8000, 11000, 20000, 22000, 16000],
    "claims": [0, 1, 2, 3, 0, 4, 1, 0, 0, 3],
    "late": [0, 2, 3, 5, 0, 4, 2, 0, 1, 3],
    "renewed": [1, 1, 0, 0, 1, 0, 1, 1, 1, 0],
}

df = pd.DataFrame(data)

X = df[["premium", "claims", "late"]]
y = df["renewed"]

pipeline = Pipeline(
    [
        ("scaler", StandardScaler()),
        ("model", LogisticRegression()),
    ]
)

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

pipeline.fit(X_train, y_train)

acc = pipeline.score(X_test, y_test)
print(f"Model trained. Test accuracy: {acc*100:.2f}%")

joblib.dump(pipeline, "renewal_model.pkl")
print("renewal_model.pkl saved in backend/models/")
