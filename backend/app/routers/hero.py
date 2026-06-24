from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.hero import Hero
from app.schemas.hero import HeroUpdate, HeroResponse
from app.schemas.common import success_response
from app.utils.auth import verify_token

router = APIRouter(prefix="/api/hero", tags=["Hero区域"])


@router.get("")
async def get_hero(db: Session = Depends(get_db), lang: str = "zh"):
    hero = db.query(Hero).first()
    if not hero:
        hero = Hero(
            title="嗨，我是开发者",
            title_en="Hi, I'm a Developer",
            subtitle="全栈开发者",
            subtitle_en="Full Stack Developer",
            description="专注于构建高性能的Web应用，热爱技术创新和开源社区",
            description_en="Focused on building high-performance web applications, passionate about tech innovation and open source",
            badge_text="全栈开发者",
            badge_text_en="Full Stack Developer",
            is_active=True
        )
        db.add(hero)
        db.commit()
        db.refresh(hero)
    
    if lang == "en":
        return success_response(data={
            "title": hero.title_en or hero.title,
            "subtitle": hero.subtitle_en or hero.subtitle,
            "description": hero.description_en or hero.description,
            "badge_text": hero.badge_text_en or hero.badge_text,
            "buttons": []
        })
    
    return success_response(data={
        "title": hero.title,
        "subtitle": hero.subtitle,
        "description": hero.description,
        "badge_text": hero.badge_text,
        "buttons": []
    })


@router.put("")
async def update_hero(
    hero_update: HeroUpdate,
    db: Session = Depends(get_db),
    credentials: dict = Depends(verify_token)
):
    hero = db.query(Hero).first()
    if not hero:
        hero = Hero()
        db.add(hero)
    
    update_data = hero_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        if key == "buttons":
            continue
        setattr(hero, key, value)
    
    db.commit()
    db.refresh(hero)
    return success_response(data={
        "title": hero.title,
        "title_en": hero.title_en,
        "subtitle": hero.subtitle,
        "subtitle_en": hero.subtitle_en,
        "description": hero.description,
        "description_en": hero.description_en,
        "badge_text": hero.badge_text,
        "badge_text_en": hero.badge_text_en,
        "buttons": []
    }, message="更新成功")
