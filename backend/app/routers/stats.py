from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.stat import Stat
from app.schemas.stat import StatCreate, StatUpdate, StatResponse
from app.schemas.common import success_response
from app.utils.auth import verify_token

router = APIRouter(prefix="/api/stats", tags=["统计数据"])


@router.get("")
async def get_stats(db: Session = Depends(get_db)):
    stats = db.query(Stat).filter(Stat.is_active == True).order_by(Stat.order).all()
    return success_response(data=[
        {
            "id": s.id,
            "value": s.value,
            "label": s.label,
            "order": s.order
        } for s in stats
    ])


@router.post("")
async def create_stat(
    stat: StatCreate,
    db: Session = Depends(get_db),
    credentials: dict = Depends(verify_token)
):
    db_stat = Stat(**stat.model_dump())
    db.add(db_stat)
    db.commit()
    db.refresh(db_stat)
    return success_response(data=StatResponse.model_validate(db_stat).model_dump(), message="创建成功")


@router.put("/{stat_id}")
async def update_stat(
    stat_id: int,
    stat_update: StatUpdate,
    db: Session = Depends(get_db),
    credentials: dict = Depends(verify_token)
):
    db_stat = db.query(Stat).filter(Stat.id == stat_id).first()
    if not db_stat:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="统计数据不存在")
    
    update_data = stat_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_stat, key, value)
    
    db.commit()
    db.refresh(db_stat)
    return success_response(data=StatResponse.model_validate(db_stat).model_dump(), message="更新成功")


@router.delete("/{stat_id}")
async def delete_stat(
    stat_id: int,
    db: Session = Depends(get_db),
    credentials: dict = Depends(verify_token)
):
    db_stat = db.query(Stat).filter(Stat.id == stat_id).first()
    if not db_stat:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="统计数据不存在")
    
    db.delete(db_stat)
    db.commit()
    return success_response(message="删除成功")
