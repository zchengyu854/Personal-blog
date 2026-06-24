from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class SkillBase(BaseModel):
    name: str
    category: str
    level: int = 0
    icon: Optional[str] = None
    color: Optional[str] = None
    order: int = 0


class SkillCreate(SkillBase):
    pass


class SkillUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    level: Optional[int] = None
    icon: Optional[str] = None
    color: Optional[str] = None
    order: Optional[int] = None


class SkillResponse(SkillBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class SkillOrderUpdate(BaseModel):
    id: int
    order: int


class SkillOrderUpdateList(BaseModel):
    orders: list[SkillOrderUpdate]
