from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.about import AboutProfile
from app.models.experience import Experience
from app.schemas.about import AboutProfileUpdate, AboutProfileResponse
from app.schemas.experience import ExperienceCreate, ExperienceUpdate, ExperienceResponse
from app.schemas.common import success_response
from app.utils.auth import verify_token

router = APIRouter(prefix="/api/about", tags=["关于我"])


@router.get("/profile")
async def get_profile(db: Session = Depends(get_db)):
    profile = db.query(AboutProfile).first()
    if not profile:
        profile = AboutProfile(title="个人简介", content="这是一个个人网站")
        db.add(profile)
        db.commit()
        db.refresh(profile)
    return success_response(data=AboutProfileResponse.model_validate(profile).model_dump())


@router.put("/profile")
async def update_profile(
    profile_update: AboutProfileUpdate,
    db: Session = Depends(get_db),
    credentials: dict = Depends(verify_token)
):
    profile = db.query(AboutProfile).first()
    if not profile:
        profile = AboutProfile()
        db.add(profile)
    
    update_data = profile_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(profile, key, value)
    
    db.commit()
    db.refresh(profile)
    return success_response(data=AboutProfileResponse.model_validate(profile).model_dump(), message="更新成功")


@router.get("/experiences")
async def get_experiences(db: Session = Depends(get_db)):
    experiences = db.query(Experience).filter(Experience.type == "work").order_by(Experience.order).all()
    return success_response(data=[
        {
            "id": e.id,
            "year": e.year,
            "title": e.title,
            "company": e.company,
            "description": e.description,
            "order": e.order
        } for e in experiences
    ])


@router.post("/experiences")
async def create_experience(
    experience: ExperienceCreate,
    db: Session = Depends(get_db),
    credentials: dict = Depends(verify_token)
):
    db_exp = Experience(**experience.model_dump())
    db.add(db_exp)
    db.commit()
    db.refresh(db_exp)
    return success_response(data=ExperienceResponse.model_validate(db_exp).model_dump(), message="创建成功")


@router.put("/experiences/{exp_id}")
async def update_experience(
    exp_id: int,
    exp_update: ExperienceUpdate,
    db: Session = Depends(get_db),
    credentials: dict = Depends(verify_token)
):
    db_exp = db.query(Experience).filter(Experience.id == exp_id).first()
    if not db_exp:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="经历不存在")
    
    update_data = exp_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_exp, key, value)
    
    db.commit()
    db.refresh(db_exp)
    return success_response(data=ExperienceResponse.model_validate(db_exp).model_dump(), message="更新成功")


@router.delete("/experiences/{exp_id}")
async def delete_experience(
    exp_id: int,
    db: Session = Depends(get_db),
    credentials: dict = Depends(verify_token)
):
    db_exp = db.query(Experience).filter(Experience.id == exp_id).first()
    if not db_exp:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="经历不存在")
    
    db.delete(db_exp)
    db.commit()
    return success_response(message="删除成功")


@router.get("/education")
async def get_education(db: Session = Depends(get_db)):
    experiences = db.query(Experience).filter(Experience.type == "education").order_by(Experience.order).all()
    return success_response(data=[
        {
            "id": e.id,
            "year": e.year,
            "title": e.title,
            "school": e.school,
            "description": e.description,
            "order": e.order
        } for e in experiences
    ])


@router.post("/education")
async def create_education(
    experience: ExperienceCreate,
    db: Session = Depends(get_db),
    credentials: dict = Depends(verify_token)
):
    db_exp = Experience(**experience.model_dump())
    db.add(db_exp)
    db.commit()
    db.refresh(db_exp)
    return success_response(data=ExperienceResponse.model_validate(db_exp).model_dump(), message="创建成功")


@router.put("/education/{exp_id}")
async def update_education(
    exp_id: int,
    exp_update: ExperienceUpdate,
    db: Session = Depends(get_db),
    credentials: dict = Depends(verify_token)
):
    db_exp = db.query(Experience).filter(Experience.id == exp_id).first()
    if not db_exp:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="教育背景不存在")
    
    update_data = exp_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_exp, key, value)
    
    db.commit()
    db.refresh(db_exp)
    return success_response(data=ExperienceResponse.model_validate(db_exp).model_dump(), message="更新成功")


@router.delete("/education/{exp_id}")
async def delete_education(
    exp_id: int,
    db: Session = Depends(get_db),
    credentials: dict = Depends(verify_token)
):
    db_exp = db.query(Experience).filter(Experience.id == exp_id).first()
    if not db_exp:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="教育背景不存在")
    
    db.delete(db_exp)
    db.commit()
    return success_response(message="删除成功")


@router.get("/achievements")
async def get_achievements(db: Session = Depends(get_db)):
    experiences = db.query(Experience).filter(Experience.type == "achievement").order_by(Experience.order).all()
    return success_response(data=[
        {
            "id": e.id,
            "year": e.year,
            "title": e.title,
            "description": e.description,
            "order": e.order
        } for e in experiences
    ])


@router.post("/achievements")
async def create_achievement(
    experience: ExperienceCreate,
    db: Session = Depends(get_db),
    credentials: dict = Depends(verify_token)
):
    db_exp = Experience(**experience.model_dump())
    db.add(db_exp)
    db.commit()
    db.refresh(db_exp)
    return success_response(data=ExperienceResponse.model_validate(db_exp).model_dump(), message="创建成功")


@router.put("/achievements/{ach_id}")
async def update_achievement(
    ach_id: int,
    exp_update: ExperienceUpdate,
    db: Session = Depends(get_db),
    credentials: dict = Depends(verify_token)
):
    db_exp = db.query(Experience).filter(Experience.id == ach_id).first()
    if not db_exp:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="成就不存在")
    
    update_data = exp_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_exp, key, value)
    
    db.commit()
    db.refresh(db_exp)
    return success_response(data=ExperienceResponse.model_validate(db_exp).model_dump(), message="更新成功")


@router.delete("/achievements/{ach_id}")
async def delete_achievement(
    ach_id: int,
    db: Session = Depends(get_db),
    credentials: dict = Depends(verify_token)
):
    db_exp = db.query(Experience).filter(Experience.id == ach_id).first()
    if not db_exp:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="成就不存在")
    
    db.delete(db_exp)
    db.commit()
    return success_response(message="删除成功")
