'use client';

import { useEffect, useState } from 'react';
import { 
  LayoutDashboard, 
  Code, 
  FolderOpen, 
  FileText, 
  Mail, 
  MessageSquare,
  TrendingUp
} from 'lucide-react';
import AdminLayout from '../../components/admin/Layout';
import { apiRequest, ApiResponse, Project, BlogPost, Skill, Message } from '../../lib/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState<{ projects: number; posts: number; skills: number; messages: number }>({
    projects: 0,
    posts: 0,
    skills: 0,
    messages: 0
  });

  const [recentProjects, setRecentProjects] = useState<Project[]>([]);
  const [recentPosts, setRecentPosts] = useState<BlogPost[]>([]);
  const [unreadMessages, setUnreadMessages] = useState<Message[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsRes, postsRes, skillsRes, messagesRes] = await Promise.all([
          apiRequest<{ items: Project[]; total: number }>('/api/projects'),
          apiRequest<{ items: BlogPost[]; total: number }>('/api/blog/posts'),
          apiRequest<Skill[]>('/api/skills'),
          apiRequest<Message[]>('/api/contact/messages'),
        ]);

        setStats({
          projects: projectsRes.data.total,
          posts: postsRes.data.total,
          skills: skillsRes.data.length,
          messages: messagesRes.data.filter((m: Message) => !m.is_read).length,
        });

        setRecentProjects(projectsRes.data.items.slice(0, 3));
        setRecentPosts(postsRes.data.items.slice(0, 3));
        setUnreadMessages(messagesRes.data.filter((m: Message) => !m.is_read).slice(0, 3));
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      }
    };

    fetchData();
  }, []);

  const statCards = [
    { label: '项目总数', value: stats.projects, icon: FolderOpen, color: 'bg-blue-500' },
    { label: '博客文章', value: stats.posts, icon: FileText, color: 'bg-green-500' },
    { label: '技能数量', value: stats.skills, icon: Code, color: 'bg-purple-500' },
    { label: '未读消息', value: stats.messages, icon: MessageSquare, color: 'bg-orange-500' },
  ];

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">欢迎回来</h1>
        <p className="text-gray-500 mt-1">管理您的个人网站内容</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-800 mt-2">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-800">最近项目</h2>
            <a href="/admin/projects" className="text-blue-600 text-sm hover:underline">查看全部</a>
          </div>
          <div className="divide-y divide-gray-100">
            {recentProjects.map((project) => (
              <div key={project.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-800">{project.title}</h3>
                    <p className="text-sm text-gray-500">{project.category}</p>
                  </div>
                  {project.is_featured && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-full">精选</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-800">最近文章</h2>
            <a href="/admin/blog" className="text-blue-600 text-sm hover:underline">查看全部</a>
          </div>
          <div className="divide-y divide-gray-100">
            {recentPosts.map((post) => (
              <div key={post.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-800">{post.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-500">{post.category}</span>
                      <span className="text-xs text-gray-400">·</span>
                      <span className="text-xs text-gray-500">{post.read_time} 分钟阅读</span>
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${post.is_published ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}>
                    {post.is_published ? '已发布' : '草稿'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {unreadMessages.length > 0 && (
        <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-800">未读消息</h2>
            <a href="/admin/contact" className="text-blue-600 text-sm hover:underline">查看全部</a>
          </div>
          <div className="divide-y divide-gray-100">
            {unreadMessages.map((message) => (
              <div key={message.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium text-gray-800">{message.name}</h3>
                    <p className="text-sm text-gray-500">{message.email}</p>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">{message.content}</p>
                  </div>
                  <span className="text-xs text-gray-400">{new Date(message.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
