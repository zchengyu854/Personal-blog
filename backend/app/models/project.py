from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, JSON, LargeBinary
from sqlalchemy.sql import func
from app.database import Base


class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(String(500), nullable=False)
    long_description = Column(Text, nullable=True)
    category = Column(String(50), nullable=False)
    image_data = Column(LargeBinary, nullable=True)
    image_mime_type = Column(String(100), nullable=True)
    image_url = Column(String(500), nullable=True)
    github_url = Column(String(500), nullable=True)
    demo_url = Column(String(500), nullable=True)
    tags = Column(JSON, default=list)
    is_featured = Column(Boolean, default=False)
    order = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
