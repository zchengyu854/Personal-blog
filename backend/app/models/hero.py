from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime
from sqlalchemy.sql import func
from app.database import Base


class Hero(Base):
    __tablename__ = "hero"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    title_en = Column(String(255), nullable=True)
    subtitle = Column(String(255), nullable=True)
    subtitle_en = Column(String(255), nullable=True)
    description = Column(Text, nullable=True)
    description_en = Column(Text, nullable=True)
    badge_text = Column(String(100), nullable=True)
    badge_text_en = Column(String(100), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
