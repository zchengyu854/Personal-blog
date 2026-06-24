from pydantic import BaseModel
from typing import Optional, List, Any
from datetime import datetime


class ApiResponse(BaseModel):
    code: int = 200
    message: str = "success"
    data: Optional[Any] = None


class LoginRequest(BaseModel):
    username: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    expires_in: int


class UserInfo(BaseModel):
    username: str
    role: str = "admin"


def success_response(data: Any = None, message: str = "success"):
    return ApiResponse(code=200, message=message, data=data)


def error_response(code: int, message: str):
    return ApiResponse(code=code, message=message, data=None)
