from fastapi import APIRouter, HTTPException, status, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from app.database import get_db
from app.models.blog import BlogPost
from app.schemas.blog import BlogPostCreate, BlogPostUpdate, BlogPostResponse
from app.schemas.common import success_response
from app.utils.auth import verify_token

router = APIRouter(prefix="/api/blog", tags=["博客"])


@router.get("/posts")
async def get_posts(
    category: Optional[str] = None,
    tag: Optional[str] = None,
    search: Optional[str] = None,
    is_published: Optional[bool] = None,
    page: int = 1,
    size: int = 10,
    db: Session = Depends(get_db)
):
    query = db.query(BlogPost)
    if category:
        query = query.filter(BlogPost.category == category)
    if tag:
        query = query.filter(BlogPost.tags.contains([tag]))
    if search:
        query = query.filter(BlogPost.title.contains(search) | BlogPost.excerpt.contains(search))
    if is_published is not None:
        query = query.filter(BlogPost.is_published == is_published)
    
    total = query.count()
    posts = query.order_by(BlogPost.created_at.desc()).offset((page - 1) * size).limit(size).all()
    
    return success_response(data={
        "items": [
            {
                "id": p.id,
                "title": p.title,
                "slug": p.slug,
                "excerpt": p.excerpt,
                "category": p.category,
                "tags": p.tags or [],
                "read_time": p.read_time,
                "is_published": p.is_published,
                "view_count": p.view_count
            } for p in posts
        ],
        "total": total,
        "page": page,
        "size": size
    })


@router.get("/posts/latest")
async def get_latest_posts(db: Session = Depends(get_db)):
    posts = db.query(BlogPost).filter(BlogPost.is_published == True).order_by(BlogPost.published_at.desc()).limit(3).all()
    return success_response(data=[
        {
            "id": p.id,
            "title": p.title,
            "slug": p.slug,
            "excerpt": p.excerpt,
            "category": p.category,
            "tags": p.tags or [],
            "read_time": p.read_time,
            "view_count": p.view_count
        } for p in posts
    ])


@router.get("/posts/{post_id}")
async def get_post(post_id: int, db: Session = Depends(get_db)):
    post = db.query(BlogPost).filter(BlogPost.id == post_id).first()
    if not post:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="文章不存在")
    return success_response(data=BlogPostResponse.model_validate(post).model_dump())


@router.get("/posts/slug/{slug}")
async def get_post_by_slug(slug: str, db: Session = Depends(get_db)):
    post = db.query(BlogPost).filter(BlogPost.slug == slug).first()
    if not post:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="文章不存在")
    post.view_count += 1
    db.commit()
    return success_response(data=BlogPostResponse.model_validate(post).model_dump())


@router.post("/posts")
async def create_post(
    post: BlogPostCreate,
    db: Session = Depends(get_db),
    credentials: dict = Depends(verify_token)
):
    db_post = BlogPost(**post.model_dump())
    db.add(db_post)
    db.commit()
    db.refresh(db_post)
    return success_response(data=BlogPostResponse.model_validate(db_post).model_dump(), message="创建成功")


@router.put("/posts/{post_id}")
async def update_post(
    post_id: int,
    post_update: BlogPostUpdate,
    db: Session = Depends(get_db),
    credentials: dict = Depends(verify_token)
):
    db_post = db.query(BlogPost).filter(BlogPost.id == post_id).first()
    if not db_post:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="文章不存在")
    
    update_data = post_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_post, key, value)
    
    db.commit()
    db.refresh(db_post)
    return success_response(data=BlogPostResponse.model_validate(db_post).model_dump(), message="更新成功")


@router.delete("/posts/{post_id}")
async def delete_post(
    post_id: int,
    db: Session = Depends(get_db),
    credentials: dict = Depends(verify_token)
):
    db_post = db.query(BlogPost).filter(BlogPost.id == post_id).first()
    if not db_post:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="文章不存在")
    
    db.delete(db_post)
    db.commit()
    return success_response(message="删除成功")


@router.put("/posts/{post_id}/publish")
async def publish_post(
    post_id: int,
    db: Session = Depends(get_db),
    credentials: dict = Depends(verify_token)
):
    db_post = db.query(BlogPost).filter(BlogPost.id == post_id).first()
    if not db_post:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="文章不存在")
    
    db_post.is_published = True
    db_post.published_at = datetime.utcnow()
    db.commit()
    db.refresh(db_post)
    return success_response(message="发布成功")


@router.get("/categories")
async def get_categories(db: Session = Depends(get_db)):
    categories = db.query(BlogPost.category).distinct().all()
    return success_response(data=[c[0] for c in categories if c[0]])


@router.get("/tags")
async def get_tags(db: Session = Depends(get_db)):
    posts = db.query(BlogPost).all()
    all_tags = set()
    for post in posts:
        if post.tags:
            all_tags.update(post.tags)
    return success_response(data=list(all_tags))


@router.put("/posts/{post_id}/view")
async def increase_view_count(
    post_id: int,
    db: Session = Depends(get_db)
):
    db_post = db.query(BlogPost).filter(BlogPost.id == post_id).first()
    if not db_post:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="文章不存在")
    
    db_post.view_count += 1
    db.commit()
    return success_response(message="阅读次数已更新")
