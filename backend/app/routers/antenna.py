import math

from fastapi import APIRouter
from pydantic import BaseModel


router = APIRouter(prefix="/antenna", tags=["antenna"])


class PatchPredictionRequest(BaseModel):
    freq: float
    er: float
    h: float


@router.post("/patch/predict")
def predict_patch_antenna(payload: PatchPredictionRequest) -> dict:
    c = 3e8
    f = payload.freq * 1e9
    h_m = payload.h / 1e3
    lambda_m = c / f
    w = (c / (2 * f)) * math.sqrt(2 / (payload.er + 1))
    er_eff = (payload.er + 1) / 2 + ((payload.er - 1) / 2) * pow(1 + (12 * h_m) / w, -0.5)
    delta_l = (
        0.412
        * h_m
        * ((er_eff + 0.3) * (w / h_m + 0.264))
        / ((er_eff - 0.258) * (w / h_m + 0.8))
    )
    length = c / (2 * f * math.sqrt(er_eff)) - 2 * delta_l
    zin = 90 * (payload.er * payload.er) / (payload.er - 1) * pow(lambda_m / (2 * w), 2)
    z0 = 50
    gamma = (zin - z0) / (zin + z0)
    s11_db = 20 * math.log10(max(abs(gamma), 1e-10))
    gain = 10 * math.log10(((4 * math.pi * w * length) / (lambda_m * lambda_m)) * 1.64)
    bandwidth = ((3.77 * (payload.er - 1)) / (payload.er * payload.er)) * (h_m / lambda_m) * 100
    efficiency = 95 - 2 * payload.er
    resonant_frequency = c / (2 * length * math.sqrt(er_eff))

    s11_sweep = []
    for index in range(40):
        fi = f * 0.7 + (index / 39) * (f * 1.3 - f * 0.7)
        zini = 90 * (payload.er * payload.er) / (payload.er - 1) * pow((c / fi) / (2 * w), 2)
        gi = (zini - z0) / (zini + z0)
        s11i = 20 * math.log10(max(abs(gi), 1e-10))
        s11_sweep.append({"f": f"{fi / 1e9:.3f}", "s11": max(s11i, -40)})

    pattern = []
    for index in range(72):
        theta = (index / 72) * 2 * math.pi
        theta_deg = (theta * 180) / math.pi
        pattern.append({"theta": theta, "r": pow(abs(math.cos((theta_deg * math.pi) / 180)), 1.5)})

    return {
        "W": f"{w * 1e3:.2f}",
        "L": f"{length * 1e3:.2f}",
        "Zin": f"{zin:.1f}",
        "S11": f"{s11_db:.2f}",
        "gain": f"{gain:.2f}",
        "BW": f"{bandwidth:.2f}",
        "eff": f"{min(max(efficiency, 60), 98):.1f}",
        "f_r": f"{resonant_frequency / 1e9:.3f}",
        "s11Sweep": s11_sweep,
        "pattern": pattern,
        "lambda_mm": f"{lambda_m * 1e3:.1f}",
    }
