from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.sql import func
from app.database import Base


class Experience(Base):
    __tablename__ = "experiences"

    id = Column(Integer, primary_key=True, index=True)
    type = Column(String(20), nullable=False)  # work/education/achievement
    title = Column(String(255), nullable=False)
    company = Column(String(255), nullable=True)
    school = Column(String(255), nullable=True)
    year = Column(String(50), nullable=True)
    description = Column(Text, nullable=True)
    order = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
