from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class MessageBase(BaseModel):
    name: str
    email: str
    subject: Optional[str] = None
    content: str


class MessageCreate(MessageBase):
    pass


class MessageResponse(MessageBase):
    id: int
    is_read: bool = False
    created_at: datetime

    class Config:
        from_attributes = True
