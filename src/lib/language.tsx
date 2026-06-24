'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type Language = 'zh' | 'en'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const translations: Record<string, Record<Language, string>> = {
  // Navbar
  'nav.home': { zh: '首页', en: 'Home' },
  'nav.about': { zh: '关于我', en: 'About' },
  'nav.skills': { zh: '技能', en: 'Skills' },
  'nav.projects': { zh: '项目', en: 'Projects' },
  'nav.blog': { zh: '博客', en: 'Blog' },
  'nav.contact': { zh: '联系', en: 'Contact' },
  'nav.menu': { zh: '菜单', en: 'Menu' },
  'nav.toggleTheme': { zh: '切换主题', en: 'Toggle Theme' },
  'nav.switchLanguage': { zh: '切换语言', en: 'Switch Language' },

  // Hero
  'hero.fullstack': { zh: '全栈开发者', en: 'Full Stack Developer' },
  'hero.subtitle': { zh: '专注于构建高性能的Web应用，热爱技术创新和开源社区', en: 'Focused on building high-performance web applications, passionate about tech innovation and open source' },
  'hero.viewProjects': { zh: '查看项目', en: 'View Projects' },
  'hero.contactMe': { zh: '联系我', en: 'Contact Me' },
  'hero.scrollDown': { zh: '向下滚动', en: 'Scroll Down' },

  // Footer
  'footer.welcome': { zh: '欢迎来到我的个人网站，这里展示了我的技术技能、项目作品和博客文章。感谢您的访问！', en: 'Welcome to my personal website showcasing my technical skills, projects and blog posts. Thanks for visiting!' },
  'footer.quickLinks': { zh: '快速链接', en: 'Quick Links' },
  'footer.contactMe': { zh: '联系我', en: 'Contact Me' },
  'footer.copyright': { zh: '版权所有', en: 'All rights reserved' },

  // Home page
  'home.featuredProjects': { zh: '精选项目', en: 'Featured Projects' },
  'home.viewAllProjects': { zh: '查看所有项目', en: 'View All Projects' },
  'home.latestBlog': { zh: '最新博客', en: 'Latest Blog' },
  'home.readMore': { zh: '阅读更多文章', en: 'Read More Articles' },
  'home.techStack': { zh: '技术栈', en: 'Tech Stack' },
  'home.mySkills': { zh: '我掌握的技术', en: 'My Skills' },
  'home.readyToStart': { zh: '准备好开始了吗？', en: 'Ready to Get Started?' },
  'home.ctaDescription': { zh: '让我们一起创建令人惊叹的数字体验。无论是网站开发、移动应用还是技术咨询，我都能帮助你实现目标。', en: "Let's create amazing digital experiences together. Whether it's web development, mobile apps or technical consulting, I can help you achieve your goals." },
  'home.learnMore': { zh: '了解更多', en: 'Learn More' },

  // About page
  'about.title': { zh: '关于我', en: 'About Me' },
  'about.subtitle': { zh: '了解我的背景、经历和成就', en: 'Learn about my background, experience and achievements' },
  'about.yearsExperience': { zh: '年开发经验', en: 'Years of Experience' },
  'about.intro': { zh: '个人简介', en: 'Introduction' },
  'about.bio': { zh: '我是一名热爱技术的全栈开发者，拥有超过5年的软件开发经验。我专注于构建高性能、可扩展的Web应用，对新技术充满热情。', en: 'I am a passionate full-stack developer with over 5 years of software development experience. I focus on building high-performance, scalable web applications and am enthusiastic about new technologies.' },
  'about.passion': { zh: '热爱开源、技术分享和持续学习', en: 'Passionate about open source, tech sharing and continuous learning' },
  'about.workExperience': { zh: '工作经历', en: 'Work Experience' },
  'about.myCareer': { zh: '我的职业生涯', en: 'My Career' },
  'about.education': { zh: '教育背景', en: 'Education' },
  'about.myLearning': { zh: '我的学习经历', en: 'My Learning Journey' },
  'about.achievements': { zh: '成就与荣誉', en: 'Achievements' },
  'about.myAchievements': { zh: '我的一些成就', en: 'Some of My Achievements' },

  // Skills page
  'skills.title': { zh: '技能展示', en: 'Skills' },
  'skills.subtitle': { zh: '我掌握的技术栈和专业能力', en: 'Technical skills and professional abilities' },
  'skills.overview': { zh: '技能概览', en: 'Skills Overview' },
  'skills.categories': { zh: '技术分类', en: 'Categories' },
  'skills.noData': { zh: '暂无技能数据', en: 'No skills data' },

  // Skill categories
  'category.frontend': { zh: '前端技术', en: 'Frontend' },
  'category.backend': { zh: '后端技术', en: 'Backend' },
  'category.database': { zh: '数据库', en: 'Database' },
  'category.devops': { zh: 'DevOps & 云服务', en: 'DevOps & Cloud' },
  'category.design': { zh: '设计', en: 'Design' },
  'category.security': { zh: '安全', en: 'Security' },

  // Projects page
  'projects.title': { zh: '项目作品', en: 'Projects' },
  'projects.subtitle': { zh: '查看我的项目作品集', en: 'View my project portfolio' },
  'projects.myProjects': { zh: '我的项目', en: 'My Projects' },
  'projects.filterProjects': { zh: '按分类筛选项目', en: 'Filter projects by category' },
  'projects.all': { zh: '全部', en: 'All' },
  'projects.noData': { zh: '暂无项目数据', en: 'No projects data' },
  'projects.github': { zh: 'GitHub', en: 'GitHub' },
  'projects.demo': { zh: '在线演示', en: 'Live Demo' },

  // Blog page
  'blog.title': { zh: '博客', en: 'Blog' },
  'blog.subtitle': { zh: '阅读我的技术文章', en: 'Read my technical articles' },
  'blog.searchPlaceholder': { zh: '搜索文章...', en: 'Search articles...' },
  'blog.category': { zh: '分类', en: 'Category' },
  'blog.tag': { zh: '标签', en: 'Tag' },
  'blog.noResults': { zh: '没有找到匹配的文章', en: 'No matching articles found' },
  'blog.readTime': { zh: '分钟阅读', en: 'min read' },
  'blog.backToList': { zh: '返回列表', en: 'Back to list' },

  // Contact page
  'contact.title': { zh: '联系我', en: 'Contact' },
  'contact.subtitle': { zh: '有任何问题或合作意向？给我留言吧！', en: 'Have questions or want to collaborate? Send me a message!' },
  'contact.sendMessage': { zh: '发送消息', en: 'Send Message' },
  'contact.fillForm': { zh: '填写表单与我取得联系', en: 'Fill out the form to get in touch' },
  'contact.name': { zh: '姓名', en: 'Name' },
  'contact.yourName': { zh: '您的姓名', en: 'Your name' },
  'contact.email': { zh: '邮箱', en: 'Email' },
  'contact.subject': { zh: '主题', en: 'Subject' },
  'contact.selectSubject': { zh: '请选择主题', en: 'Please select a subject' },
  'contact.consultation': { zh: '技术咨询', en: 'Technical Consulting' },
  'contact.cooperation': { zh: '项目合作', en: 'Project Cooperation' },
  'contact.job': { zh: '工作机会', en: 'Job Opportunity' },
  'contact.other': { zh: '其他', en: 'Other' },
  'contact.message': { zh: '消息内容', en: 'Message' },
  'contact.enterMessage': { zh: '请输入您的消息...', en: 'Please enter your message...' },
  'contact.sending': { zh: '发送中...', en: 'Sending...' },
  'contact.sendBtn': { zh: '发送消息', en: 'Send Message' },
  'contact.success': { zh: '消息发送成功！我会尽快回复您。', en: 'Message sent successfully! I will reply as soon as possible.' },
  'contact.contactInfo': { zh: '联系方式', en: 'Contact Info' },
  'contact.variousWays': { zh: '多种方式与我联系', en: 'Various ways to reach me' },
  'contact.readyToStart': { zh: '准备好开始了吗？', en: 'Ready to Get Started?' },
  'contact.letsCreate': { zh: '无论您有什么想法，我都很乐意倾听。让我们一起创造些了不起的东西！', en: "Whatever ideas you have, I'm happy to listen. Let's create something amazing together!" },
  'contact.sendEmail': { zh: '立即发送邮件', en: 'Send Email Now' },
  'contact.contactMe': { zh: '联系我', en: 'Contact Me' },

  // Contact types
  'contact.type.email': { zh: '邮箱', en: 'Email' },
  'contact.type.phone': { zh: '电话', en: 'Phone' },
  'contact.type.address': { zh: '地址', en: 'Address' },
  'contact.type.social': { zh: '社交', en: 'Social' },
}

const defaultContext: LanguageContextType = {
  language: 'zh',
  setLanguage: () => {},
  t: (key: string) => translations[key]?.zh || key,
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('zh')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedLang = localStorage.getItem('language') as Language
    if (savedLang) {
      setLanguage(savedLang)
    }
  }, [])

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang)
    localStorage.setItem('language', lang)
  }

  const t = (key: string): string => {
    return translations[key]?.[language] || key
  }

  const contextValue: LanguageContextType = {
    language,
    setLanguage: handleSetLanguage,
    t,
  }

  return (
    <LanguageContext.Provider value={mounted ? contextValue : defaultContext}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }
  return context
}
