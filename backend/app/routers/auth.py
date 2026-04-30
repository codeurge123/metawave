from fastapi import APIRouter, Depends, HTTPException, status

from app.dependencies import get_current_user
from app.schemas import PasswordUpdate, TokenResponse, UserCreate, UserPublic, UserSignin
from app.security import create_access_token
from app.users import authenticate_user, create_user, update_user_password


router = APIRouter(prefix="/auth", tags=["auth"])


def _token_response(user: dict) -> TokenResponse:
    token = create_access_token(subject=str(user["id"]))
    return TokenResponse(access_token=token, user=UserPublic(**user))


@router.post("/signup", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def signup(payload: UserCreate) -> TokenResponse:
    user = create_user(payload)
    return _token_response(user)


@router.post("/signin", response_model=TokenResponse)
def signin(payload: UserSignin) -> TokenResponse:
    user = authenticate_user(payload.email, payload.password)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
        )
    return _token_response(user)


@router.get("/me", response_model=UserPublic)
def me(current_user: dict = Depends(get_current_user)) -> UserPublic:
    return UserPublic(**current_user)


@router.patch("/password")
def update_password(payload: PasswordUpdate, current_user: dict = Depends(get_current_user)) -> dict:
    updated = update_user_password(
        user_id=current_user["id"],
        current_password=payload.current_password,
        new_password=payload.new_password,
    )
    if not updated:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password is incorrect.",
        )
    return {"message": "Password updated successfully."}
