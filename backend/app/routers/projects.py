from fastapi import APIRouter, HTTPException, status, Depends, Query, File, UploadFile, Form, Request
from fastapi.responses import Response
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models.project import Project
from app.schemas.project import ProjectCreate, ProjectUpdate, ProjectResponse
from app.schemas.common import success_response
from app.utils.auth import verify_token
import json

router = APIRouter(prefix="/api/projects", tags=["项目"])


def get_image_url(project: Project, request: Request = None) -> Optional[str]:
    if project.image_data:
        return f"/api/projects/{project.id}/image"
    return project.image_url


@router.get("")
async def get_projects(
    category: Optional[str] = None,
    is_featured: Optional[bool] = None,
    page: int = 1,
    size: int = 10,
    db: Session = Depends(get_db),
    request: Request = None
):
    query = db.query(Project)
    if category:
        query = query.filter(Project.category == category)
    if is_featured is not None:
        query = query.filter(Project.is_featured == is_featured)
    
    total = query.count()
    projects = query.order_by(Project.order).offset((page - 1) * size).limit(size).all()
    
    return success_response(data={
        "items": [
            {
                "id": p.id,
                "title": p.title,
                "description": p.description,
                "category": p.category,
                "image_url": get_image_url(p, request),
                "github_url": p.github_url,
                "demo_url": p.demo_url,
                "tags": p.tags or [],
                "is_featured": p.is_featured
            } for p in projects
        ],
        "total": total,
        "page": page,
        "size": size
    })


@router.get("/featured")
async def get_featured_projects(db: Session = Depends(get_db), request: Request = None):
    projects = db.query(Project).filter(Project.is_featured == True).order_by(Project.order).limit(6).all()
    return success_response(data=[
        {
            "id": p.id,
            "title": p.title,
            "description": p.description,
            "category": p.category,
            "image_url": get_image_url(p, request),
            "github_url": p.github_url,
            "demo_url": p.demo_url,
            "tags": p.tags or [],
            "is_featured": p.is_featured
        } for p in projects
    ])


@router.get("/{project_id}")
async def get_project(project_id: int, db: Session = Depends(get_db), request: Request = None):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="项目不存在")
    
    response_data = ProjectResponse.model_validate(project).model_dump()
    response_data["image_url"] = get_image_url(project, request)
    return success_response(data=response_data)


@router.get("/{project_id}/image")
async def get_project_image(project_id: int, db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="项目不存在")
    
    if not project.image_data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="项目没有图片")
    
    return Response(
        content=project.image_data,
        media_type=project.image_mime_type or "image/png"
    )


@router.post("")
async def create_project(
    title: str = Form(...),
    description: str = Form(...),
    long_description: Optional[str] = Form(None),
    category: str = Form(...),
    github_url: Optional[str] = Form(None),
    demo_url: Optional[str] = Form(None),
    tags: Optional[str] = Form(None),
    is_featured: str = Form("false"),
    order: str = Form("0"),
    image: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    credentials: dict = Depends(verify_token),
    request: Request = None
):
    try:
        tags_list = json.loads(tags) if tags else []
    except json.JSONDecodeError:
        tags_list = [t.strip() for t in tags.split(',')] if tags else []
    
    db_project = Project(
        title=title,
        description=description,
        long_description=long_description,
        category=category,
        github_url=github_url,
        demo_url=demo_url,
        tags=tags_list,
        is_featured=is_featured.lower() == 'true',
        order=int(order)
    )
    
    if image:
        db_project.image_data = await image.read()
        db_project.image_mime_type = image.content_type
    
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    
    response_data = ProjectResponse.model_validate(db_project).model_dump()
    response_data["image_url"] = get_image_url(db_project, request)
    return success_response(data=response_data, message="创建成功")


@router.put("/{project_id}")
async def update_project(
    project_id: int,
    title: Optional[str] = Form(None),
    description: Optional[str] = Form(None),
    long_description: Optional[str] = Form(None),
    category: Optional[str] = Form(None),
    github_url: Optional[str] = Form(None),
    demo_url: Optional[str] = Form(None),
    tags: Optional[str] = Form(None),
    is_featured: Optional[str] = Form(None),
    order: Optional[str] = Form(None),
    image: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    credentials: dict = Depends(verify_token),
    request: Request = None
):
    db_project = db.query(Project).filter(Project.id == project_id).first()
    if not db_project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="项目不存在")
    
    if title is not None:
        db_project.title = title
    if description is not None:
        db_project.description = description
    if long_description is not None:
        db_project.long_description = long_description
    if category is not None:
        db_project.category = category
    if github_url is not None:
        db_project.github_url = github_url
    if demo_url is not None:
        db_project.demo_url = demo_url
    if tags is not None:
        try:
            db_project.tags = json.loads(tags)
        except json.JSONDecodeError:
            db_project.tags = [t.strip() for t in tags.split(',')] if tags else []
    if is_featured is not None:
        db_project.is_featured = is_featured.lower() == 'true'
    if order is not None:
        db_project.order = int(order)
    
    if image:
        db_project.image_data = await image.read()
        db_project.image_mime_type = image.content_type
    
    db.commit()
    db.refresh(db_project)
    
    response_data = ProjectResponse.model_validate(db_project).model_dump()
    response_data["image_url"] = get_image_url(db_project, request)
    return success_response(data=response_data, message="更新成功")


@router.delete("/{project_id}")
async def delete_project(
    project_id: int,
    db: Session = Depends(get_db),
    credentials: dict = Depends(verify_token)
):
    db_project = db.query(Project).filter(Project.id == project_id).first()
    if not db_project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="项目不存在")
    
    db.delete(db_project)
    db.commit()
    return success_response(message="删除成功")


@router.put("/featured")
async def update_featured_projects(
    featured_ids: List[int],
    db: Session = Depends(get_db),
    credentials: dict = Depends(verify_token)
):
    db.query(Project).update({Project.is_featured: False})
    for pid in featured_ids:
        project = db.query(Project).filter(Project.id == pid).first()
        if project:
            project.is_featured = True
    db.commit()
    return success_response(message="精选项目更新成功")
