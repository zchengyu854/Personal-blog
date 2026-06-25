/*
 Navicat Premium Dump SQL

 Source Server         : Me
 Source Server Type    : PostgreSQL
 Source Server Version : 150016 (150016)
 Source Host           : localhost:5432
 Source Catalog        : portfolio
 Source Schema         : public

 Target Server Type    : PostgreSQL
 Target Server Version : 150016 (150016)
 File Encoding         : 65001

 Date: 24/06/2026 17:01:02
*/


-- ----------------------------
-- Sequence structure for blog_posts_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."blog_posts_id_seq";
CREATE SEQUENCE "public"."blog_posts_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;
ALTER SEQUENCE "public"."blog_posts_id_seq" OWNER TO "postgres";

-- ----------------------------
-- Sequence structure for contacts_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."contacts_id_seq";
CREATE SEQUENCE "public"."contacts_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;
ALTER SEQUENCE "public"."contacts_id_seq" OWNER TO "postgres";

-- ----------------------------
-- Sequence structure for experiences_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."experiences_id_seq";
CREATE SEQUENCE "public"."experiences_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;
ALTER SEQUENCE "public"."experiences_id_seq" OWNER TO "postgres";

-- ----------------------------
-- Sequence structure for hero_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."hero_id_seq";
CREATE SEQUENCE "public"."hero_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;
ALTER SEQUENCE "public"."hero_id_seq" OWNER TO "postgres";

-- ----------------------------
-- Sequence structure for messages_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."messages_id_seq";
CREATE SEQUENCE "public"."messages_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;
ALTER SEQUENCE "public"."messages_id_seq" OWNER TO "postgres";

-- ----------------------------
-- Sequence structure for projects_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."projects_id_seq";
CREATE SEQUENCE "public"."projects_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;
ALTER SEQUENCE "public"."projects_id_seq" OWNER TO "postgres";

-- ----------------------------
-- Sequence structure for skills_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."skills_id_seq";
CREATE SEQUENCE "public"."skills_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;
ALTER SEQUENCE "public"."skills_id_seq" OWNER TO "postgres";

-- ----------------------------
-- Sequence structure for stats_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."stats_id_seq";
CREATE SEQUENCE "public"."stats_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;
ALTER SEQUENCE "public"."stats_id_seq" OWNER TO "postgres";

-- ----------------------------
-- Table structure for blog_posts
-- ----------------------------
DROP TABLE IF EXISTS "public"."blog_posts";
CREATE TABLE "public"."blog_posts" (
  "id" int4 NOT NULL GENERATED ALWAYS AS IDENTITY (
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1
),
  "title" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "slug" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "excerpt" varchar(500) COLLATE "pg_catalog"."default" NOT NULL,
  "content" text COLLATE "pg_catalog"."default" NOT NULL,
  "category" varchar(50) COLLATE "pg_catalog"."default" NOT NULL,
  "tags" json DEFAULT '[]'::json,
  "read_time" int4 DEFAULT 0,
  "cover_image" varchar(500) COLLATE "pg_catalog"."default",
  "is_published" bool DEFAULT false,
  "published_at" timestamptz(6),
  "view_count" int4 DEFAULT 0,
  "created_at" timestamptz(6) DEFAULT now(),
  "updated_at" timestamptz(6) DEFAULT now()
)
;
ALTER TABLE "public"."blog_posts" OWNER TO "postgres";

-- ----------------------------
-- Records of blog_posts
-- ----------------------------
BEGIN;
INSERT INTO "public"."blog_posts" ("id", "title", "slug", "excerpt", "content", "category", "tags", "read_time", "cover_image", "is_published", "published_at", "view_count", "created_at", "updated_at") OVERRIDING SYSTEM VALUE VALUES (1, 'React最佳实践', 'react-best-practices', '本文介绍React开发的最佳实践，帮助你编写更高质量的代码', '## 引言

React是一个非常流行的前端框架，本文将分享一些实用的最佳实践。

## 1. 使用函数组件

优先使用函数组件和Hooks...', '技术分享', '["React", "前端", "最佳实践"]', 10, NULL, 't', NULL, 0, '2026-06-22 14:29:41.245335+00', '2026-06-22 14:29:41.245335+00');
INSERT INTO "public"."blog_posts" ("id", "title", "slug", "excerpt", "content", "category", "tags", "read_time", "cover_image", "is_published", "published_at", "view_count", "created_at", "updated_at") OVERRIDING SYSTEM VALUE VALUES (2, 'TypeScript入门指南', 'typescript-getting-started', 'TypeScript入门指南，从零开始学习TypeScript', '## 什么是TypeScript

TypeScript是JavaScript的超集...', '技术分享', '["TypeScript", "前端", "教程"]', 15, NULL, 't', NULL, 0, '2026-06-22 14:29:41.245335+00', '2026-06-22 14:29:41.245335+00');
INSERT INTO "public"."blog_posts" ("id", "title", "slug", "excerpt", "content", "category", "tags", "read_time", "cover_image", "is_published", "published_at", "view_count", "created_at", "updated_at") OVERRIDING SYSTEM VALUE VALUES (3, 'Node.js后端开发实战', 'nodejs-backend-tutorial', '使用Node.js构建RESTful API的完整指南', '## 创建项目

首先创建一个新的Node.js项目...', '项目实战', '["Node.js", "后端", "API"]', 20, NULL, 't', NULL, 0, '2026-06-22 14:29:41.245335+00', '2026-06-22 14:29:41.245335+00');
COMMIT;

-- ----------------------------
-- Table structure for contacts
-- ----------------------------
DROP TABLE IF EXISTS "public"."contacts";
CREATE TABLE "public"."contacts" (
  "id" int4 NOT NULL GENERATED ALWAYS AS IDENTITY (
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1
),
  "type" varchar(50) COLLATE "pg_catalog"."default" NOT NULL,
  "content" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "link" varchar(500) COLLATE "pg_catalog"."default",
  "is_active" bool DEFAULT true,
  "order" int4 DEFAULT 0,
  "created_at" timestamptz(6) DEFAULT now(),
  "updated_at" timestamptz(6) DEFAULT now()
)
;
ALTER TABLE "public"."contacts" OWNER TO "postgres";

-- ----------------------------
-- Records of contacts
-- ----------------------------
BEGIN;
INSERT INTO "public"."contacts" ("id", "type", "content", "link", "is_active", "order", "created_at", "updated_at") OVERRIDING SYSTEM VALUE VALUES (2, 'social', 'GitHub', 'https://github.com/username', 't', 2, '2026-06-22 14:29:41.245335+00', '2026-06-22 14:29:41.245335+00');
INSERT INTO "public"."contacts" ("id", "type", "content", "link", "is_active", "order", "created_at", "updated_at") OVERRIDING SYSTEM VALUE VALUES (3, 'social', 'LinkedIn', 'https://linkedin.com/in/username', 't', 3, '2026-06-22 14:29:41.245335+00', '2026-06-22 14:29:41.245335+00');
INSERT INTO "public"."contacts" ("id", "type", "content", "link", "is_active", "order", "created_at", "updated_at") OVERRIDING SYSTEM VALUE VALUES (4, 'phone', '+86 138-xxxx-xxxx', 'tel:+86138xxxxxxxx', 't', 4, '2026-06-22 14:29:41.245335+00', '2026-06-22 14:29:41.245335+00');
INSERT INTO "public"."contacts" ("id", "type", "content", "link", "is_active", "order", "created_at", "updated_at") OVERRIDING SYSTEM VALUE VALUES (1, 'email', '190499367@qq.com', 'mailto:190499367@qq.com', 't', 1, '2026-06-22 14:29:41.245335+00', '2026-06-23 14:26:38.045419+00');
INSERT INTO "public"."contacts" ("id", "type", "content", "link", "is_active", "order", "created_at", "updated_at") OVERRIDING SYSTEM VALUE VALUES (5, 'address', '北京市朝阳区', NULL, 't', 3, '2026-06-23 14:26:38.045419+00', '2026-06-23 14:26:38.045419+00');
COMMIT;

-- ----------------------------
-- Table structure for experiences
-- ----------------------------
DROP TABLE IF EXISTS "public"."experiences";
CREATE TABLE "public"."experiences" (
  "id" int4 NOT NULL GENERATED ALWAYS AS IDENTITY (
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1
),
  "type" varchar(20) COLLATE "pg_catalog"."default" NOT NULL,
  "title" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "company" varchar(255) COLLATE "pg_catalog"."default",
  "school" varchar(255) COLLATE "pg_catalog"."default",
  "year" varchar(50) COLLATE "pg_catalog"."default",
  "description" text COLLATE "pg_catalog"."default",
  "order" int4 DEFAULT 0,
  "created_at" timestamptz(6) DEFAULT now(),
  "updated_at" timestamptz(6) DEFAULT now()
)
;
ALTER TABLE "public"."experiences" OWNER TO "postgres";

-- ----------------------------
-- Records of experiences
-- ----------------------------
BEGIN;
INSERT INTO "public"."experiences" ("id", "type", "title", "company", "school", "year", "description", "order", "created_at", "updated_at") OVERRIDING SYSTEM VALUE VALUES (1, 'work', '高级前端工程师', '某科技公司', NULL, '2022-至今', '负责公司核心产品的前端架构设计与开发，带领团队完成多个重要项目', 1, '2026-06-22 14:29:41.245335+00', '2026-06-22 14:29:41.245335+00');
INSERT INTO "public"."experiences" ("id", "type", "title", "company", "school", "year", "description", "order", "created_at", "updated_at") OVERRIDING SYSTEM VALUE VALUES (2, 'work', '全栈开发工程师', '某互联网公司', NULL, '2020-2022', '独立负责多个项目的全栈开发，积累了丰富的项目经验', 2, '2026-06-22 14:29:41.245335+00', '2026-06-22 14:29:41.245335+00');
INSERT INTO "public"."experiences" ("id", "type", "title", "company", "school", "year", "description", "order", "created_at", "updated_at") OVERRIDING SYSTEM VALUE VALUES (3, 'education', '计算机科学硕士', '某某大学', NULL, '2018-2020', '研究方向：Web开发与分布式系统', 3, '2026-06-22 14:29:41.245335+00', '2026-06-22 14:29:41.245335+00');
INSERT INTO "public"."experiences" ("id", "type", "title", "company", "school", "year", "description", "order", "created_at", "updated_at") OVERRIDING SYSTEM VALUE VALUES (4, 'achievement', '开源项目贡献者', '', NULL, '2023', '为多个知名开源项目贡献代码，包括React、Vue等', 4, '2026-06-22 14:29:41.245335+00', '2026-06-22 14:29:41.245335+00');
COMMIT;

-- ----------------------------
-- Table structure for hero
-- ----------------------------
DROP TABLE IF EXISTS "public"."hero";
CREATE TABLE "public"."hero" (
  "id" int4 NOT NULL GENERATED ALWAYS AS IDENTITY (
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1
),
  "title" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "subtitle" varchar(255) COLLATE "pg_catalog"."default",
  "description" text COLLATE "pg_catalog"."default",
  "badge_text" varchar(100) COLLATE "pg_catalog"."default",
  "is_active" bool DEFAULT true,
  "created_at" timestamptz(6) DEFAULT now(),
  "updated_at" timestamptz(6) DEFAULT now(),
  "title_en" varchar(255) COLLATE "pg_catalog"."default",
  "subtitle_en" varchar(255) COLLATE "pg_catalog"."default",
  "description_en" text COLLATE "pg_catalog"."default",
  "badge_text_en" varchar(100) COLLATE "pg_catalog"."default"
)
;
ALTER TABLE "public"."hero" OWNER TO "postgres";

-- ----------------------------
-- Records of hero
-- ----------------------------
BEGIN;
INSERT INTO "public"."hero" ("id", "title", "subtitle", "description", "badge_text", "is_active", "created_at", "updated_at", "title_en", "subtitle_en", "description_en", "badge_text_en") OVERRIDING SYSTEM VALUE VALUES (1, '嗨，我是Agent开发者', 'Agent开发者', '专注于构建高性能的Web应用和优雅的用户体验', 'Agent开发者', 't', '2026-06-22 14:29:41.245335+00', '2026-06-23 14:22:09.518697+00', 'Hi, I''m an Agent Developer', 'Agent Developer', 'Focused on building high-performance web applications and elegant user experiences', 'Agent Developer');
COMMIT;

-- ----------------------------
-- Table structure for messages
-- ----------------------------
DROP TABLE IF EXISTS "public"."messages";
CREATE TABLE "public"."messages" (
  "id" int4 NOT NULL GENERATED ALWAYS AS IDENTITY (
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1
),
  "name" varchar(100) COLLATE "pg_catalog"."default" NOT NULL,
  "email" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "subject" varchar(255) COLLATE "pg_catalog"."default",
  "content" text COLLATE "pg_catalog"."default" NOT NULL,
  "is_read" bool DEFAULT false,
  "created_at" timestamptz(6) DEFAULT now()
)
;
ALTER TABLE "public"."messages" OWNER TO "postgres";

-- ----------------------------
-- Records of messages
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for projects
-- ----------------------------
DROP TABLE IF EXISTS "public"."projects";
CREATE TABLE "public"."projects" (
  "id" int4 NOT NULL GENERATED ALWAYS AS IDENTITY (
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1
),
  "title" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "description" varchar(500) COLLATE "pg_catalog"."default" NOT NULL,
  "long_description" text COLLATE "pg_catalog"."default",
  "category" varchar(50) COLLATE "pg_catalog"."default" NOT NULL,
  "image_url" varchar(500) COLLATE "pg_catalog"."default",
  "github_url" varchar(500) COLLATE "pg_catalog"."default",
  "demo_url" varchar(500) COLLATE "pg_catalog"."default",
  "tags" json DEFAULT '[]'::json,
  "is_featured" bool DEFAULT false,
  "order" int4 DEFAULT 0,
  "created_at" timestamptz(6) DEFAULT now(),
  "updated_at" timestamptz(6) DEFAULT now(),
  "image_data" bytea,
  "image_mime_type" varchar(100) COLLATE "pg_catalog"."default"
)
;
ALTER TABLE "public"."projects" OWNER TO "postgres";

-- ----------------------------
-- Records of projects
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for skills
-- ----------------------------
DROP TABLE IF EXISTS "public"."skills";
CREATE TABLE "public"."skills" (
  "id" int4 NOT NULL GENERATED ALWAYS AS IDENTITY (
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1
),
  "name" varchar(100) COLLATE "pg_catalog"."default" NOT NULL,
  "category" varchar(50) COLLATE "pg_catalog"."default" NOT NULL,
  "level" int4 DEFAULT 0,
  "icon" varchar(50) COLLATE "pg_catalog"."default",
  "color" varchar(50) COLLATE "pg_catalog"."default",
  "order" int4 DEFAULT 0,
  "created_at" timestamptz(6) DEFAULT now(),
  "updated_at" timestamptz(6) DEFAULT now()
)
;
ALTER TABLE "public"."skills" OWNER TO "postgres";

-- ----------------------------
-- Records of skills
-- ----------------------------
BEGIN;
INSERT INTO "public"."skills" ("id", "name", "category", "level", "icon", "color", "order", "created_at", "updated_at") OVERRIDING SYSTEM VALUE VALUES (8, 'Git', '工具', 90, NULL, NULL, 8, '2026-06-22 14:29:41.245335+00', '2026-06-22 14:29:41.245335+00');
INSERT INTO "public"."skills" ("id", "name", "category", "level", "icon", "color", "order", "created_at", "updated_at") OVERRIDING SYSTEM VALUE VALUES (9, 'Docker', '工具', 75, NULL, NULL, 9, '2026-06-22 14:29:41.245335+00', '2026-06-22 14:29:41.245335+00');
INSERT INTO "public"."skills" ("id", "name", "category", "level", "icon", "color", "order", "created_at", "updated_at") OVERRIDING SYSTEM VALUE VALUES (11, 'MySQL', '数据库', 90, NULL, '', 0, '2026-06-23 12:21:33.566316+00', '2026-06-23 12:21:33.566316+00');
INSERT INTO "public"."skills" ("id", "name", "category", "level", "icon", "color", "order", "created_at", "updated_at") OVERRIDING SYSTEM VALUE VALUES (5, 'Python', '后端开发', 75, NULL, NULL, 1, '2026-06-22 14:29:41.245335+00', '2026-06-23 12:35:05.101969+00');
INSERT INTO "public"."skills" ("id", "name", "category", "level", "icon", "color", "order", "created_at", "updated_at") OVERRIDING SYSTEM VALUE VALUES (10, 'Java', '后端开发', 90, NULL, '', 2, '2026-06-23 12:21:04.799976+00', '2026-06-23 12:50:48.459758+00');
INSERT INTO "public"."skills" ("id", "name", "category", "level", "icon", "color", "order", "created_at", "updated_at") OVERRIDING SYSTEM VALUE VALUES (6, 'PostgreSQL', '数据库', 75, NULL, NULL, 1, '2026-06-22 14:29:41.245335+00', '2026-06-23 12:50:55.076137+00');
COMMIT;

-- ----------------------------
-- Table structure for stats
-- ----------------------------
DROP TABLE IF EXISTS "public"."stats";
CREATE TABLE "public"."stats" (
  "id" int4 NOT NULL GENERATED ALWAYS AS IDENTITY (
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1
),
  "value" varchar(50) COLLATE "pg_catalog"."default" NOT NULL,
  "label" varchar(100) COLLATE "pg_catalog"."default" NOT NULL,
  "order" int4 DEFAULT 0,
  "is_active" bool DEFAULT true,
  "created_at" timestamptz(6) DEFAULT now(),
  "updated_at" timestamptz(6) DEFAULT now()
)
;
ALTER TABLE "public"."stats" OWNER TO "postgres";

-- ----------------------------
-- Records of stats
-- ----------------------------
BEGIN;
INSERT INTO "public"."stats" ("id", "value", "label", "order", "is_active", "created_at", "updated_at") OVERRIDING SYSTEM VALUE VALUES (1, '5+', '年开发经验', 1, 't', '2026-06-22 14:29:41.245335+00', '2026-06-22 14:29:41.245335+00');
INSERT INTO "public"."stats" ("id", "value", "label", "order", "is_active", "created_at", "updated_at") OVERRIDING SYSTEM VALUE VALUES (2, '50+', '完成项目', 2, 't', '2026-06-22 14:29:41.245335+00', '2026-06-22 14:29:41.245335+00');
INSERT INTO "public"."stats" ("id", "value", "label", "order", "is_active", "created_at", "updated_at") OVERRIDING SYSTEM VALUE VALUES (3, '100+', '技术文章', 3, 't', '2026-06-22 14:29:41.245335+00', '2026-06-22 14:29:41.245335+00');
INSERT INTO "public"."stats" ("id", "value", "label", "order", "is_active", "created_at", "updated_at") OVERRIDING SYSTEM VALUE VALUES (4, '10+', '开源贡献', 4, 't', '2026-06-22 14:29:41.245335+00', '2026-06-22 14:29:41.245335+00');
COMMIT;

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."blog_posts_id_seq"
OWNED BY "public"."blog_posts"."id";
SELECT setval('"public"."blog_posts_id_seq"', 3, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."contacts_id_seq"
OWNED BY "public"."contacts"."id";
SELECT setval('"public"."contacts_id_seq"', 5, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."experiences_id_seq"
OWNED BY "public"."experiences"."id";
SELECT setval('"public"."experiences_id_seq"', 4, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."hero_id_seq"
OWNED BY "public"."hero"."id";
SELECT setval('"public"."hero_id_seq"', 1, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."messages_id_seq"
OWNED BY "public"."messages"."id";
SELECT setval('"public"."messages_id_seq"', 1, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."projects_id_seq"
OWNED BY "public"."projects"."id";
SELECT setval('"public"."projects_id_seq"', 8, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."skills_id_seq"
OWNED BY "public"."skills"."id";
SELECT setval('"public"."skills_id_seq"', 11, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."stats_id_seq"
OWNED BY "public"."stats"."id";
SELECT setval('"public"."stats_id_seq"', 4, true);

-- ----------------------------
-- Auto increment value for blog_posts
-- ----------------------------
SELECT setval('"public"."blog_posts_id_seq"', 3, true);

-- ----------------------------
-- Uniques structure for table blog_posts
-- ----------------------------
ALTER TABLE "public"."blog_posts" ADD CONSTRAINT "blog_posts_slug_key" UNIQUE ("slug");

-- ----------------------------
-- Primary Key structure for table blog_posts
-- ----------------------------
ALTER TABLE "public"."blog_posts" ADD CONSTRAINT "blog_posts_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Auto increment value for contacts
-- ----------------------------
SELECT setval('"public"."contacts_id_seq"', 5, true);

-- ----------------------------
-- Primary Key structure for table contacts
-- ----------------------------
ALTER TABLE "public"."contacts" ADD CONSTRAINT "contacts_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Auto increment value for experiences
-- ----------------------------
SELECT setval('"public"."experiences_id_seq"', 4, true);

-- ----------------------------
-- Primary Key structure for table experiences
-- ----------------------------
ALTER TABLE "public"."experiences" ADD CONSTRAINT "experiences_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Auto increment value for hero
-- ----------------------------
SELECT setval('"public"."hero_id_seq"', 1, true);

-- ----------------------------
-- Primary Key structure for table hero
-- ----------------------------
ALTER TABLE "public"."hero" ADD CONSTRAINT "hero_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Auto increment value for messages
-- ----------------------------
SELECT setval('"public"."messages_id_seq"', 1, true);

-- ----------------------------
-- Primary Key structure for table messages
-- ----------------------------
ALTER TABLE "public"."messages" ADD CONSTRAINT "messages_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Auto increment value for projects
-- ----------------------------
SELECT setval('"public"."projects_id_seq"', 8, true);

-- ----------------------------
-- Primary Key structure for table projects
-- ----------------------------
ALTER TABLE "public"."projects" ADD CONSTRAINT "projects_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Auto increment value for skills
-- ----------------------------
SELECT setval('"public"."skills_id_seq"', 11, true);

-- ----------------------------
-- Primary Key structure for table skills
-- ----------------------------
ALTER TABLE "public"."skills" ADD CONSTRAINT "skills_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Auto increment value for stats
-- ----------------------------
SELECT setval('"public"."stats_id_seq"', 4, true);

-- ----------------------------
-- Primary Key structure for table stats
-- ----------------------------
ALTER TABLE "public"."stats" ADD CONSTRAINT "stats_pkey" PRIMARY KEY ("id");
