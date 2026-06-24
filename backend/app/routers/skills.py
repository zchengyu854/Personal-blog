from fastapi import APIRouter, HTTPException, status, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models.skill import Skill
from app.schemas.skill import SkillCreate, SkillUpdate, SkillResponse, SkillOrderUpdate
from app.schemas.common import success_response
from app.utils.auth import verify_token

router = APIRouter(prefix="/api/skills", tags=["技能"])


@router.get("")
async def get_skills(
    category: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Skill)
    if category:
        query = query.filter(Skill.category == category)
    skills = query.order_by(Skill.order).all()
    return success_response(data=[
        {
            "id": s.id,
            "name": s.name,
            "category": s.category,
            "level": s.level,
            "icon": s.icon,
            "color": s.color,
            "order": s.order
        } for s in skills
    ])


@router.get("/categories")
async def get_skill_categories(db: Session = Depends(get_db)):
    categories = db.query(Skill.category).distinct().all()
    return success_response(data=[c[0] for c in categories])


@router.post("")
async def create_skill(
    skill: SkillCreate,
    db: Session = Depends(get_db),
    credentials: dict = Depends(verify_token)
):
    db_skill = Skill(**skill.model_dump())
    db.add(db_skill)
    db.commit()
    db.refresh(db_skill)
    return success_response(data=SkillResponse.model_validate(db_skill).model_dump(), message="创建成功")


@router.put("/order")
async def update_skills_order(
    orders: List[SkillOrderUpdate],
    db: Session = Depends(get_db),
    credentials: dict = Depends(verify_token)
):
    for item in orders:
        skill = db.query(Skill).filter(Skill.id == item.id).first()
        if skill:
            skill.order = item.order
    db.commit()
    return success_response(message="排序更新成功")


@router.put("/{skill_id}")
async def update_skill(
    skill_id: int,
    skill_update: SkillUpdate,
    db: Session = Depends(get_db),
    credentials: dict = Depends(verify_token)
):
    db_skill = db.query(Skill).filter(Skill.id == skill_id).first()
    if not db_skill:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="技能不存在")
    
    update_data = skill_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_skill, key, value)
    
    db.commit()
    db.refresh(db_skill)
    return success_response(data=SkillResponse.model_validate(db_skill).model_dump(), message="更新成功")


@router.delete("/{skill_id}")
async def delete_skill(
    skill_id: int,
    db: Session = Depends(get_db),
    credentials: dict = Depends(verify_token)
):
    db_skill = db.query(Skill).filter(Skill.id == skill_id).first()
    if not db_skill:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="技能不存在")
    
    db.delete(db_skill)
    db.commit()
    return success_response(message="删除成功")
