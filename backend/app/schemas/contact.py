from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class ContactBase(BaseModel):
    type: str
    content: str
    link: Optional[str] = None
    is_active: bool = True
    order: int = 0


class ContactCreate(ContactBase):
    pass


class ContactUpdate(BaseModel):
    type: Optional[str] = None
    content: Optional[str] = None
    link: Optional[str] = None
    is_active: Optional[bool] = None
    order: Optional[int] = None


class ContactResponse(ContactBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
