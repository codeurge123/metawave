from functools import lru_cache
import hashlib
from pathlib import Path
from typing import Optional

import joblib
import pandas as pd
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel


MODEL_DIR = Path(__file__).resolve().parents[2] / "ml"
PATCH_FEATURES = [
    "Sub_W",
    "Sub_L",
    "Sub_H",
    "Patch_W",
    "Patch_L",
    "Feed_W",
    "Slot1_W",
    "Slot1_L",
    "Slot2_W",
    "Slot2_L",
    "Freq_GHz",
]
PATCH_SWEEP_FREQUENCIES = [1, 2, 4, 6, 10, 12, 26, 28, 30, 36, 37, 38, 40, 42, 46, 50]

router = APIRouter(prefix="/antenna", tags=["antenna"])


class PatchPredictionRequest(BaseModel):
    Sub_W: float
    Sub_L: float
    Sub_H: float
    Patch_W: float
    Patch_L: float
    Feed_W: float
    Slot1_W: float
    Slot1_L: float
    Slot2_W: float
    Slot2_L: float
    Freq_GHz: float


class PatchPredictionResponse(BaseModel):
    gain: float
    S11: float
    gainSweep: list[dict[str, float]]
    s11Sweep: list[dict[str, float]]
    features: list[str]


class PatchModelStatus(BaseModel):
    gain_model: str
    gain_sha256: Optional[str]
    s11_model: str
    s11_sha256: Optional[str]
    features: list[str]


@lru_cache
def load_patch_models() -> tuple[object, object]:
    gain_model_path = MODEL_DIR / "patch_gain_model.pkl"
    s11_model_path = MODEL_DIR / "patch_s11_model.pkl"

    if not gain_model_path.exists():
        raise FileNotFoundError(f"Missing model at {gain_model_path}")
    if not s11_model_path.exists():
        raise FileNotFoundError(f"Missing model at {s11_model_path}")

    return joblib.load(gain_model_path), joblib.load(s11_model_path)


def file_sha256(path: Path) -> Optional[str]:
    if not path.exists():
        return None

    digest = hashlib.sha256()
    with path.open("rb") as file:
        for chunk in iter(lambda: file.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def payload_to_frame(payload: PatchPredictionRequest) -> pd.DataFrame:
    return pd.DataFrame([{feature: getattr(payload, feature) for feature in PATCH_FEATURES}], columns=PATCH_FEATURES)


def build_frequency_sweep(payload: PatchPredictionRequest) -> pd.DataFrame:
    base_row = {feature: getattr(payload, feature) for feature in PATCH_FEATURES}
    rows = []
    for frequency in PATCH_SWEEP_FREQUENCIES:
        row = {**base_row, "Freq_GHz": float(frequency)}
        rows.append(row)
    return pd.DataFrame(rows, columns=PATCH_FEATURES)


@router.get("/patch/model-status", response_model=PatchModelStatus)
def patch_model_status() -> PatchModelStatus:
    gain_model_path = MODEL_DIR / "patch_gain_model.pkl"
    s11_model_path = MODEL_DIR / "patch_s11_model.pkl"

    return PatchModelStatus(
        gain_model=str(gain_model_path),
        gain_sha256=file_sha256(gain_model_path),
        s11_model=str(s11_model_path),
        s11_sha256=file_sha256(s11_model_path),
        features=PATCH_FEATURES,
    )


@router.post("/patch/predict", response_model=PatchPredictionResponse)
def predict_patch_antenna(payload: PatchPredictionRequest) -> PatchPredictionResponse:
    try:
        gain_model, s11_model = load_patch_models()
    except Exception as exc:
        raise HTTPException(status_code=503, detail=f"Patch antenna ML models are not available: {exc}") from exc

    input_df = payload_to_frame(payload)
    sweep_df = build_frequency_sweep(payload)

    try:
        predicted_gain = float(gain_model.predict(input_df)[0])
        predicted_s11 = float(s11_model.predict(input_df)[0])
        gain_sweep = gain_model.predict(sweep_df)
        s11_sweep = s11_model.predict(sweep_df)
    except Exception as exc:
        raise HTTPException(status_code=422, detail=f"Patch antenna prediction failed: {exc}") from exc

    return PatchPredictionResponse(
        gain=round(predicted_gain, 4),
        S11=round(predicted_s11, 4),
        gainSweep=[
            {"f": float(frequency), "gain": round(float(gain), 4)}
            for frequency, gain in zip(PATCH_SWEEP_FREQUENCIES, gain_sweep)
        ],
        s11Sweep=[
            {"f": float(frequency), "s11": round(float(s11), 4)}
            for frequency, s11 in zip(PATCH_SWEEP_FREQUENCIES, s11_sweep)
        ],
        features=PATCH_FEATURES,
    )
