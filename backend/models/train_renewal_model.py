import pandas as pd
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
import joblib

data = {
    "premium": [10000, 12000, 15000, 9000, 14000, 8000, 11000, 20000, 22000, 16000],
    "claims": [0, 1, 2, 3, 0, 4, 1, 0, 0, 3],
    "late": [0, 2, 3, 5, 0, 4, 2, 0, 1, 3],
    "renewed": [1,1,0,0,1,0,1,1,1,0]
}

df = pd.DataFrame(data)

X = df[['premium','claims','late']]
y = df['renewed']

pipeline = Pipeline([
    ("scaler", StandardScaler()),
    ("model", LogisticRegression())
])

pipeline.fit(X, y)

joblib.dump(pipeline, "renewal_model.pkl")
print("Model trained and saved!")
