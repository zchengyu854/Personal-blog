from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.config import settings
from app.routers import auth, hero, stats, about, skills, projects, blog, contact
import logging
import traceback

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title=settings.APP_NAME,
    description="管理个人网站内容的RESTful API",
    version="1.0.0"
)

origins = settings.ALLOWED_ORIGINS.split(",") if settings.ALLOWED_ORIGINS else ["http://localhost:3000", "http://localhost:3001", "http://localhost:3002"]

logger.info(f"允许的源: {origins}")
logger.info(f"DEBUG模式: {settings.DEBUG}")
logger.info(f"DATABASE_URL配置: {'已配置' if settings.DATABASE_URL else '未配置'}")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
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


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"全局异常: {str(exc)}")
    logger.error(traceback.format_exc())
    return JSONResponse(
        status_code=500,
        content={"code": -1, "message": str(exc), "data": None}
    )
