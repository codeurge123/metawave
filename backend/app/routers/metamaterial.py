from functools import lru_cache
import hashlib
from pathlib import Path
from typing import Optional

import joblib
import pandas as pd
from xgboost import XGBRegressor
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel


FEATURES = ["Wm", "W0m", "dm", "tm", "rows", "Xa", "Ya"]
MODEL_DIR = Path(__file__).resolve().parents[2] / "ml"

router = APIRouter(prefix="/metamaterial", tags=["metamaterial"])


class MetamaterialPredictionRequest(BaseModel):
    Wm: float
    W0m: float
    dm: float
    tm: float
    rows: float
    Xa: float
    Ya: float


class MetamaterialPredictionResponse(BaseModel):
    gain: float
    s11: float
    bandwidth: float


class MetamaterialModelStatus(BaseModel):
    gain_model: str
    gain_sha256: Optional[str]
    s11_model: str
    s11_sha256: Optional[str]
    bandwidth_model: str
    bandwidth_sha256: Optional[str]
    features: list[str]


@lru_cache
def load_models() -> tuple[object, object, object]:
    gain_native_path = MODEL_DIR / "gain_model.json"
    s11_native_path = MODEL_DIR / "s11_model.json"
    gain_pickle_path = MODEL_DIR / "gain_model.pkl"
    s11_pickle_path = MODEL_DIR / "s11_model.pkl"
    bandwidth_model_path = MODEL_DIR / "bandwidth_model.pkl"

    if not bandwidth_model_path.exists():
        raise FileNotFoundError(f"Missing model at {bandwidth_model_path}")

    if gain_pickle_path.exists():
        xgb_gain = joblib.load(gain_pickle_path)
    elif gain_native_path.exists():
        xgb_gain = XGBRegressor()
        xgb_gain.load_model(gain_native_path)
    else:
        raise FileNotFoundError(f"Missing model at {gain_pickle_path} or {gain_native_path}")

    if s11_pickle_path.exists():
        xgb_s11 = joblib.load(s11_pickle_path)
    elif s11_native_path.exists():
        xgb_s11 = XGBRegressor()
        xgb_s11.load_model(s11_native_path)
    else:
        raise FileNotFoundError(f"Missing model at {s11_pickle_path} or {s11_native_path}")

    rf_bw = joblib.load(bandwidth_model_path)

    return xgb_gain, xgb_s11, rf_bw


@router.get("/model-status", response_model=MetamaterialModelStatus)
def model_status() -> MetamaterialModelStatus:
    gain_native_path = MODEL_DIR / "gain_model.json"
    s11_native_path = MODEL_DIR / "s11_model.json"
    bandwidth_model_path = MODEL_DIR / "bandwidth_model.pkl"
    gain_pickle_path = MODEL_DIR / "gain_model.pkl"
    s11_pickle_path = MODEL_DIR / "s11_model.pkl"
    gain_model_path = gain_pickle_path if gain_pickle_path.exists() else gain_native_path
    s11_model_path = s11_pickle_path if s11_pickle_path.exists() else s11_native_path

    return MetamaterialModelStatus(
        gain_model=str(gain_model_path),
        gain_sha256=file_sha256(gain_model_path),
        s11_model=str(s11_model_path),
        s11_sha256=file_sha256(s11_model_path),
        bandwidth_model=str(bandwidth_model_path),
        bandwidth_sha256=file_sha256(bandwidth_model_path),
        features=FEATURES,
    )


def file_sha256(path: Path) -> Optional[str]:
    if not path.exists():
        return None

    digest = hashlib.sha256()
    with path.open("rb") as file:
        for chunk in iter(lambda: file.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


@router.post("/predict", response_model=MetamaterialPredictionResponse)
def predict_metamaterial(payload: MetamaterialPredictionRequest) -> MetamaterialPredictionResponse:
    try:
        xgb_gain, xgb_s11, rf_bw = load_models()
    except Exception as exc:
        raise HTTPException(status_code=503, detail=f"Metamaterial ML models are not available: {exc}") from exc

    input_df = pd.DataFrame(
        [[payload.Wm, payload.W0m, payload.dm, payload.tm, payload.rows, payload.Xa, payload.Ya]],
        columns=FEATURES,
    )

    try:
        gain = xgb_gain.predict(input_df)[0]
        s11 = xgb_s11.predict(input_df)[0]
        bandwidth = rf_bw.predict(input_df)[0]

        return MetamaterialPredictionResponse(
            gain=round(float(gain), 3),
            s11=round(float(s11), 3),
            bandwidth=round(float(bandwidth), 3),
        )
    except Exception as exc:
        raise HTTPException(status_code=422, detail=f"Prediction failed: {exc}") from exc
