from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class StatBase(BaseModel):
    value: str
    label: str
    order: int = 0
    is_active: bool = True


class StatCreate(StatBase):
    pass


class StatUpdate(BaseModel):
    value: Optional[str] = None
    label: Optional[str] = None
    order: Optional[int] = None
    is_active: Optional[bool] = None


class StatResponse(StatBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
