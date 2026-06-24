# 个人网站后台 API

基于 FastAPI 构建的个人网站后台管理系统，提供 RESTful API 接口用于管理网站内容。

## 技术栈

### 核心框架
- **FastAPI** - 高性能 Python Web 框架，支持自动生成 API 文档
- **Uvicorn** - ASGI 服务器，用于运行 FastAPI 应用

### 数据层
- **SQLAlchemy** - 数据库 ORM 框架，提供对象关系映射
- **PostgreSQL** - 关系型数据库
- **Alembic** - 数据库迁移工具

### 认证与安全
- **python-jose** - JWT 令牌生成与验证
- **passlib[bcrypt]** - 密码哈希处理

### 数据验证
- **Pydantic** - 数据模型验证
- **pydantic-settings** - 配置管理，支持从环境变量加载

### 文件上传
- **python-multipart** - 支持文件上传

## 项目结构

```
backend/
├── app/
│   ├── models/          # 数据库模型
│   ├── routers/         # API 路由
│   ├── schemas/         # Pydantic 数据模型
│   ├── services/        # 业务逻辑层
│   ├── utils/           # 工具函数
│   ├── config.py        # 配置管理
│   ├── database.py      # 数据库连接
│   └── main.py          # 应用入口
├── .env                 # 环境变量配置
├── requirements.txt     # 依赖列表
└── portfolio.db         # SQLite 数据库文件（开发环境）
```

## 环境要求

- Python >= 3.10
- PostgreSQL >= 13

## 安装与启动

### 1. 安装依赖

```bash
python3 -m pip install -r requirements.txt
```

### 2. 配置环境变量

编辑 `.env` 文件，配置数据库连接等信息：

```env
APP_NAME=个人网站后台
DEBUG=true
DATABASE_URL=postgresql://postgres:password@localhost:5432/portfolio
JWT_SECRET_KEY=your-secret-key-change-in-production
JWT_ALGORITHM=HS256
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=60
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
```

### 3. 数据库迁移

```bash
# 创建迁移目录（首次使用）
alembic init alembic

# 创建迁移脚本
alembic revision --autogenerate -m "initial migration"

# 执行迁移
alembic upgrade head
```

### 4. 启动开发服务器

```bash
python3 -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

启动后访问：
- API 文档: http://localhost:8000/docs
- 自动生成的 OpenAPI 文档: http://localhost:8000/redoc

## API 接口

### 认证
- `POST /auth/login` - 管理员登录
- `POST /auth/logout` - 登出

### 网站内容管理
- `GET/POST/PUT/DELETE /hero` - 首页英雄区
- `GET/POST/PUT/DELETE /stats` - 数据统计
- `GET/POST/PUT/DELETE /about` - 关于我
- `GET/POST/PUT/DELETE /skills` - 技能
- `GET/POST/PUT/DELETE /projects` - 项目
- `GET/POST/PUT/DELETE /blog` - 博客
- `GET/POST/PUT/DELETE /contact` - 联系方式

## 默认管理员账号

- 用户名: `admin`
- 密码: `admin123`

> **注意**: 生产环境请务必修改默认密码和 JWT_SECRET_KEY
