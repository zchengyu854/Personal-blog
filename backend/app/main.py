from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.routers import auth, hero, stats, about, skills, projects, blog, contact

app = FastAPI(
    title=settings.APP_NAME,
    description="管理个人网站内容的RESTful API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001", "http://localhost:3002"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(hero.router)
app.include_router(stats.router)
app.include_router(about.router)
app.include_router(skills.router)
app.include_router(projects.router)
app.include_router(blog.router)
app.include_router(contact.router)


@app.get("/")
async def root():
    return {"message": "个人网站后台API服务运行中"}


@app.get("/health")
async def health_check():
    return {"status": "healthy"}
