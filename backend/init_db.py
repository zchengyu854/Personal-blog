from app.database import engine, Base
from app.models.hero import Hero
from app.models.skill import Skill
from app.models.project import Project
from app.models.blog import BlogPost
from app.models.stat import Stat
from app.models.contact import Contact
from app.models.message import Message
from app.models.experience import Experience
from app.models.about import AboutProfile, Achievement

print("正在创建数据库表...")
Base.metadata.create_all(bind=engine)
print("数据库表创建成功！")