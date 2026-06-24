from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class ExperienceBase(BaseModel):
    type: str
    title: str
    company: Optional[str] = None
    school: Optional[str] = None
    year: Optional[str] = None
    description: Optional[str] = None
    order: int = 0


class ExperienceCreate(ExperienceBase):
    pass


class ExperienceUpdate(BaseModel):
    type: Optional[str] = None
    title: Optional[str] = None
    company: Optional[str] = None
    school: Optional[str] = None
    year: Optional[str] = None
    description: Optional[str] = None
    order: Optional[int] = None


class ExperienceResponse(ExperienceBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
