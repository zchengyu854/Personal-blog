from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class AboutProfileBase(BaseModel):
    title: str
    content: str


class AboutProfileUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None


class AboutProfileResponse(AboutProfileBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
