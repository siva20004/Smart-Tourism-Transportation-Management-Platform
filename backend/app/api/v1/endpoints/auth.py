from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from backend.app.core.database import get_db
from backend.app.core.security import verify_password, create_access_token
from backend.app.models.entities import User

router = APIRouter()

class LoginRequest(BaseModel):
    email: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: str
    email: str
    full_name: Optional[str]

@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()
    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    if not user.is_active:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Inactive user")

    token = create_access_token(user.id)
    return TokenResponse(
        access_token=token,
        role=user.role,
        email=user.email,
        full_name=user.full_name
    )

@router.get("/me")
def get_current_user_info():
    return {
        "status": "authenticated",
        "demo_admin": "admin@fujikyu.co.jp",
        "role": "admin",
        "company": "Fuji Kyuko Co., Ltd."
    }
