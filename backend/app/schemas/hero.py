from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class HeroButton(BaseModel):
    text: str
    link: str
    type: str = "primary"


class HeroBase(BaseModel):
    title: str
    title_en: Optional[str] = None
    subtitle: Optional[str] = None
    subtitle_en: Optional[str] = None
    description: Optional[str] = None
    description_en: Optional[str] = None
    badge_text: Optional[str] = None
    badge_text_en: Optional[str] = None
    buttons: List[HeroButton] = []


class HeroUpdate(BaseModel):
    title: Optional[str] = None
    title_en: Optional[str] = None
    subtitle: Optional[str] = None
    subtitle_en: Optional[str] = None
    description: Optional[str] = None
    description_en: Optional[str] = None
    badge_text: Optional[str] = None
    badge_text_en: Optional[str] = None
    buttons: Optional[List[HeroButton]] = None


class HeroResponse(HeroBase):
    id: int
    is_active: bool = True
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
