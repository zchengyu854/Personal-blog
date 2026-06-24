from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.common import LoginRequest, success_response, error_response, UserInfo
from app.utils.auth import authenticate_admin, verify_token, create_access_token, decode_token

router = APIRouter(prefix="/api/auth", tags=["认证"])


@router.post("/login")
async def login(request: LoginRequest):
    result = authenticate_admin(request.username, request.password)
    if not result:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password"
        )
    return success_response(data=result.model_dump(), message="登录成功")


@router.get("/me")
async def get_current_user(credentials: dict = Depends(verify_token)):
    username = credentials.get("sub")
    return success_response(data=UserInfo(username=username).model_dump())


@router.post("/refresh")
async def refresh_token(credentials: dict = Depends(verify_token)):
    raise HTTPException(status_code=status.HTTP_501_NOT_IMPLEMENTED, detail="Not implemented")


@router.put("/password")
async def change_password(credentials: dict = Depends(verify_token)):
    raise HTTPException(status_code=status.HTTP_501_NOT_IMPLEMENTED, detail="Not implemented")
