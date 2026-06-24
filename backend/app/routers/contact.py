from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.contact import Contact
from app.models.message import Message
from app.schemas.contact import ContactCreate, ContactUpdate, ContactResponse
from app.schemas.message import MessageCreate, MessageResponse
from app.schemas.common import success_response
from app.utils.auth import verify_token

router = APIRouter(prefix="/api/contact", tags=["联系方式"])


@router.get("/info")
async def get_contact_info(db: Session = Depends(get_db)):
    contacts = db.query(Contact).filter(Contact.is_active == True).order_by(Contact.order).all()
    return success_response(data=[
        {
            "id": c.id,
            "type": c.type,
            "content": c.content,
            "link": c.link,
            "order": c.order
        } for c in contacts
    ])


@router.post("/info")
async def create_contact(
    contact: ContactCreate,
    db: Session = Depends(get_db),
    credentials: dict = Depends(verify_token)
):
    db_contact = Contact(**contact.model_dump())
    db.add(db_contact)
    db.commit()
    db.refresh(db_contact)
    return success_response(data=ContactResponse.model_validate(db_contact).model_dump(), message="创建成功")


@router.put("/info/{contact_id}")
async def update_contact(
    contact_id: int,
    contact_update: ContactUpdate,
    db: Session = Depends(get_db),
    credentials: dict = Depends(verify_token)
):
    db_contact = db.query(Contact).filter(Contact.id == contact_id).first()
    if not db_contact:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="联系信息不存在")
    
    update_data = contact_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_contact, key, value)
    
    db.commit()
    db.refresh(db_contact)
    return success_response(data=ContactResponse.model_validate(db_contact).model_dump(), message="更新成功")


@router.delete("/info/{contact_id}")
async def delete_contact(
    contact_id: int,
    db: Session = Depends(get_db),
    credentials: dict = Depends(verify_token)
):
    db_contact = db.query(Contact).filter(Contact.id == contact_id).first()
    if not db_contact:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="联系信息不存在")
    
    db.delete(db_contact)
    db.commit()
    return success_response(message="删除成功")


@router.post("/message")
async def submit_message(
    message: MessageCreate,
    db: Session = Depends(get_db)
):
    db_message = Message(**message.model_dump())
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    return success_response(message="消息发送成功，我们会尽快回复您")


@router.get("/messages")
async def get_messages(
    db: Session = Depends(get_db),
    credentials: dict = Depends(verify_token)
):
    messages = db.query(Message).order_by(Message.created_at.desc()).all()
    return success_response(data=[
        MessageResponse.model_validate(m).model_dump() for m in messages
    ])


@router.put("/messages/{message_id}/read")
async def mark_message_read(
    message_id: int,
    db: Session = Depends(get_db),
    credentials: dict = Depends(verify_token)
):
    db_message = db.query(Message).filter(Message.id == message_id).first()
    if not db_message:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="消息不存在")
    
    db_message.is_read = True
    db.commit()
    return success_response(message="已标记为已读")


@router.delete("/messages/{message_id}")
async def delete_message(
    message_id: int,
    db: Session = Depends(get_db),
    credentials: dict = Depends(verify_token)
):
    db_message = db.query(Message).filter(Message.id == message_id).first()
    if not db_message:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="消息不存在")
    
    db.delete(db_message)
    db.commit()
    return success_response(message="删除成功")
