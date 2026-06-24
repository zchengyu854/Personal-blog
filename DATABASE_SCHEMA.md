# 数据库设计文档

## 数据库配置

- **数据库类型**: PostgreSQL
- **连接地址**: `postgresql://postgres:postgres@localhost:5432/portfolio`
- **ORM**: SQLAlchemy

---

## 数据表结构

### 1. hero (首页Hero区域)

存储首页Hero区域的配置信息。

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| id | INTEGER | PRIMARY KEY, INDEX | 主键 |
| title | VARCHAR(255) | NOT NULL | 主标题 |
| subtitle | VARCHAR(255) | NULLABLE | 副标题 |
| description | TEXT | NULLABLE | 描述内容 |
| badge_text | VARCHAR(100) | NULLABLE | 标签文本 |
| is_active | BOOLEAN | DEFAULT TRUE | 是否激活 |
| created_at | TIMESTAMP | DEFAULT NOW() | 创建时间 |
| updated_at | TIMESTAMP | DEFAULT NOW() | 更新时间 |

**前端对应页面**: `/admin/hero`

---

### 2. skills (技能)

存储技能列表数据。

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| id | INTEGER | PRIMARY KEY, INDEX | 主键 |
| name | VARCHAR(100) | NOT NULL | 技能名称 |
| category | VARCHAR(50) | NOT NULL | 分类（如：前端、后端、工具等） |
| level | INTEGER | DEFAULT 0 | 熟练度（0-100） |
| icon | VARCHAR(50) | NULLABLE | 图标标识 |
| color | VARCHAR(50) | NULLABLE | 颜色样式 |
| order | INTEGER | DEFAULT 0 | 排序序号 |
| created_at | TIMESTAMP | DEFAULT NOW() | 创建时间 |
| updated_at | TIMESTAMP | DEFAULT NOW() | 更新时间 |

**前端对应页面**: `/admin/skills`

**分类示例**:
- 前端开发
- 后端开发
- 数据库
- 工具/其他

---

### 3. projects (项目)

存储项目作品集数据。

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| id | INTEGER | PRIMARY KEY, INDEX | 主键 |
| title | VARCHAR(255) | NOT NULL | 项目名称 |
| description | VARCHAR(500) | NOT NULL | 简短描述 |
| long_description | TEXT | NULLABLE | 详细描述 |
| category | VARCHAR(50) | NOT NULL | 项目分类 |
| image_url | VARCHAR(500) | NULLABLE | 项目图片URL |
| github_url | VARCHAR(500) | NULLABLE | GitHub链接 |
| demo_url | VARCHAR(500) | NULLABLE | 演示链接 |
| tags | JSON | DEFAULT [] | 技术标签数组 |
| is_featured | BOOLEAN | DEFAULT FALSE | 是否精选 |
| order | INTEGER | DEFAULT 0 | 排序序号 |
| created_at | TIMESTAMP | DEFAULT NOW() | 创建时间 |
| updated_at | TIMESTAMP | DEFAULT NOW() | 更新时间 |

**前端对应页面**: `/admin/projects`

**分类示例**:
- Web应用
- 移动应用
- API服务
- 工具/其他

**tags字段示例**: `["React", "TypeScript", "Next.js", "Node.js"]`

---

### 4. blog_posts (博客文章)

存储博客文章数据。

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| id | INTEGER | PRIMARY KEY, INDEX | 主键 |
| title | VARCHAR(255) | NOT NULL | 文章标题 |
| slug | VARCHAR(255) | NOT NULL, UNIQUE, INDEX | URL别名 |
| excerpt | VARCHAR(500) | NOT NULL | 文章摘要 |
| content | TEXT | NOT NULL | 文章内容（Markdown） |
| category | VARCHAR(50) | NOT NULL | 文章分类 |
| tags | JSON | DEFAULT [] | 标签数组 |
| read_time | INTEGER | DEFAULT 0 | 预计阅读时长（分钟） |
| cover_image | VARCHAR(500) | NULLABLE | 封面图片URL |
| is_published | BOOLEAN | DEFAULT FALSE | 是否发布 |
| published_at | TIMESTAMP | NULLABLE | 发布时间 |
| view_count | INTEGER | DEFAULT 0 | 阅读次数 |
| created_at | TIMESTAMP | DEFAULT NOW() | 创建时间 |
| updated_at | TIMESTAMP | DEFAULT NOW() | 更新时间 |

**前端对应页面**: `/admin/blog`

**分类示例**:
- 技术分享
- 项目实战
- 学习笔记
- 生活随笔

---

### 5. stats (统计数据)

存储首页展示的统计数据。

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| id | INTEGER | PRIMARY KEY, INDEX | 主键 |
| value | VARCHAR(50) | NOT NULL | 统计数值（如："5+"、"100+"） |
| label | VARCHAR(100) | NOT NULL | 统计标签（如："年开发经验"） |
| order | INTEGER | DEFAULT 0 | 排序序号 |
| is_active | BOOLEAN | DEFAULT TRUE | 是否显示 |
| created_at | TIMESTAMP | DEFAULT NOW() | 创建时间 |
| updated_at | TIMESTAMP | DEFAULT NOW() | 更新时间 |

**前端对应页面**: `/admin/stats`

**示例数据**:
| value | label |
|-------|-------|
| 5+ | 年开发经验 |
| 50+ | 完成项目 |
| 100+ | 技术文章 |
| 10+ | 开源贡献 |

---

### 6. contacts (联系方式)

存储联系信息。

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| id | INTEGER | PRIMARY KEY, INDEX | 主键 |
| type | VARCHAR(50) | NOT NULL | 类型（email/phone/address/social） |
| content | VARCHAR(255) | NOT NULL | 内容 |
| link | VARCHAR(500) | NULLABLE | 链接地址 |
| is_active | BOOLEAN | DEFAULT TRUE | 是否显示 |
| order | INTEGER | DEFAULT 0 | 排序序号 |
| created_at | TIMESTAMP | DEFAULT NOW() | 创建时间 |
| updated_at | TIMESTAMP | DEFAULT NOW() | 更新时间 |

**前端对应页面**: `/admin/contact`

**类型说明**:
- `email`: 电子邮箱
- `phone`: 电话号码
- `address`: 地址
- `social`: 社交媒体链接

**示例数据**:
| type | content | link |
|------|---------|------|
| email | developer@example.com | mailto:developer@example.com |
| phone | +86 138-xxxx-xxxx | tel:+86138xxxxxxxx |
| social | GitHub | https://github.com/username |
| social | LinkedIn | https://linkedin.com/in/username |

---

### 7. messages (留言消息)

存储用户提交的联系消息。

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| id | INTEGER | PRIMARY KEY, INDEX | 主键 |
| name | VARCHAR(100) | NOT NULL | 发送者姓名 |
| email | VARCHAR(255) | NOT NULL | 发送者邮箱 |
| subject | VARCHAR(255) | NULLABLE | 消息主题 |
| content | TEXT | NOT NULL | 消息内容 |
| is_read | BOOLEAN | DEFAULT FALSE | 是否已读 |
| created_at | TIMESTAMP | DEFAULT NOW() | 创建时间 |

**前端对应页面**: `/admin/contact`（消息管理部分）

---

### 8. experiences (经历)

存储工作经历、教育背景、成就荣誉等。

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| id | INTEGER | PRIMARY KEY, INDEX | 主键 |
| type | VARCHAR(20) | NOT NULL | 类型（work/education/achievement） |
| title | VARCHAR(255) | NOT NULL | 标题 |
| company | VARCHAR(255) | NULLABLE | 公司名称（工作经历） |
| school | VARCHAR(255) | NULLABLE | 学校名称（教育背景） |
| year | VARCHAR(50) | NULLABLE | 时间描述 |
| description | TEXT | NULLABLE | 详细描述 |
| order | INTEGER | DEFAULT 0 | 排序序号 |
| created_at | TIMESTAMP | DEFAULT NOW() | 创建时间 |
| updated_at | TIMESTAMP | DEFAULT NOW() | 更新时间 |

**前端对应页面**: `/admin/about`（关于我页面）

**类型说明**:
- `work`: 工作经历
- `education`: 教育背景
- `achievement`: 成就荣誉

---

## 数据库初始化

### PostgreSQL 安装与配置

```bash
# macOS (Homebrew)
brew install postgresql
brew services start postgresql

# 创建数据库
createdb portfolio

# 或使用 psql
psql -U postgres
CREATE DATABASE portfolio;
```

### 初始化表结构

```bash
cd backend
python3 -c "
from app.database import engine, Base
from app.models.hero import Hero
from app.models.skill import Skill
from app.models.project import Project
from app.models.blog import BlogPost
from app.models.stat import Stat
from app.models.contact import Contact
from app.models.message import Message
from app.models.experience import Experience

Base.metadata.create_all(bind=engine)
print('数据库表创建成功')
"
```

---

## API 接口对应

| 模块 | API路径 | 数据表 |
|------|---------|--------|
| 认证 | `/api/auth/*` | 无（使用配置文件） |
| Hero | `/api/hero` | hero |
| 统计 | `/api/stats` | stats |
| 技能 | `/api/skills` | skills |
| 项目 | `/api/projects` | projects |
| 博客 | `/api/blog/posts` | blog_posts |
| 联系信息 | `/api/contact/info` | contacts |
| 消息 | `/api/contact/messages` | messages |
| 经历 | `/api/about/experiences` | experiences |

---

## 管理后台页面对应

| 页面路径 | 功能 | 数据表 |
|----------|------|--------|
| `/admin` | Dashboard仪表盘 | 多表统计 |
| `/admin/hero` | Hero区域管理 | hero |
| `/admin/skills` | 技能管理 | skills |
| `/admin/projects` | 项目管理 | projects |
| `/admin/blog` | 博客管理 | blog_posts |
| `/admin/contact` | 联系信息+消息管理 | contacts, messages |
| `/admin/stats` | 统计数据管理 | stats |

---

## 示例数据 SQL

```sql
-- Hero
INSERT INTO hero (title, subtitle, description, badge_text, is_active)
VALUES ('嗨，我是开发者', '全栈开发者', '专注于构建高性能的Web应用', '全栈开发者', true);

-- Stats
INSERT INTO stats (value, label, order) VALUES
('5+', '年开发经验', 1),
('50+', '完成项目', 2),
('100+', '技术文章', 3);

-- Skills
INSERT INTO skills (name, category, level, order) VALUES
('React', '前端开发', 90, 1),
('TypeScript', '前端开发', 85, 2),
('Node.js', '后端开发', 80, 3),
('PostgreSQL', '数据库', 75, 4);

-- Projects
INSERT INTO projects (title, description, category, tags, is_featured, order) VALUES
('个人博客', '基于Next.js构建的个人博客系统', 'Web应用', '["Next.js", "React", "TypeScript"]', true, 1);

-- Blog Posts
INSERT INTO blog_posts (title, slug, excerpt, content, category, read_time, is_published) VALUES
('React最佳实践', 'react-best-practices', '本文介绍React开发的最佳实践...', '## 引言\n...', '技术分享', 10, true);

-- Contact
INSERT INTO contacts (type, content, link, order) VALUES
('email', 'developer@example.com', 'mailto:developer@example.com', 1),
('social', 'GitHub', 'https://github.com/username', 2);
```