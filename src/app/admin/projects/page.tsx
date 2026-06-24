'use client';

import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Save, X, Star, ImageIcon } from 'lucide-react';
import AdminLayout from '../../../components/admin/Layout';
import { apiRequest, ApiResponse, Project } from '../../../lib/api';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await apiRequest<{ items: Project[]; total: number }>('/api/projects', 'GET', undefined, false);
        setProjects(response.data.items);
      } catch (error) {
        console.error('Failed to fetch projects:', error);
      }
      setLoading(false);
    };

    fetchProjects();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setSelectedImage(null);
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;

    const formData = new FormData();
    formData.append('title', editingProject.title);
    formData.append('description', editingProject.description);
    if (editingProject.long_description) {
      formData.append('long_description', editingProject.long_description);
    }
    formData.append('category', editingProject.category);
    if (editingProject.github_url) {
      formData.append('github_url', editingProject.github_url);
    }
    if (editingProject.demo_url) {
      formData.append('demo_url', editingProject.demo_url);
    }
    formData.append('tags', JSON.stringify(editingProject.tags));
    formData.append('is_featured', String(editingProject.is_featured));
    formData.append('order', String(editingProject.order));
    if (selectedImage) {
      formData.append('image', selectedImage);
    }

    try {
      if (editingProject.id) {
        await apiRequest<Project>(
          `/api/projects/${editingProject.id}`,
          'PUT',
          formData
        );
        setMessage('项目更新成功！');
      } else {
        await apiRequest<Project>('/api/projects', 'POST', formData);
        setMessage('项目创建成功！');
      }
      setShowForm(false);
      setEditingProject(null);
      setSelectedImage(null);
      setImagePreview(null);
      window.location.reload();
    } catch (error) {
      setMessage('操作失败，请重试');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('确定要删除这个项目吗？')) return;

    try {
      await apiRequest<{}>(`/api/projects/${id}`, 'DELETE');
      setProjects(projects.filter((p) => p.id !== id));
      setMessage('删除成功！');
    } catch (error) {
      setMessage('删除失败，请重试');
    }
  };

  const handleToggleFeatured = async (project: Project) => {
    try {
      const formData = new FormData();
      formData.append('is_featured', String(!project.is_featured));
      await apiRequest<Project>(
        `/api/projects/${project.id}`,
        'PUT',
        formData
      );
      setProjects(projects.map((p) =>
        p.id === project.id ? { ...p, is_featured: !p.is_featured } : p
      ));
      setMessage(project.is_featured ? '已取消精选' : '已设为精选');
    } catch (error) {
      setMessage('操作失败，请重试');
    }
  };

  const handleAdd = () => {
    setEditingProject({
      id: 0,
      title: '',
      description: '',
      long_description: '',
      category: '',
      image_url: '',
      github_url: '',
      demo_url: '',
      tags: [],
      is_featured: false,
      order: 0,
      created_at: '',
      updated_at: '',
    });
    setShowForm(true);
  };

  const handleEdit = (project: Project) => {
    setEditingProject({ ...project });
    setSelectedImage(null);
    setImagePreview(project.image_url || null);
    setShowForm(true);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">项目管理</h1>
          <p className="text-gray-500 mt-1">管理您的项目作品集</p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          添加项目
        </button>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-lg ${message.includes('成功') || message.includes('精选') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div
            key={project.id}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="relative">
              <div className={`h-48 ${project.image_url ? 'bg-cover bg-center' : 'bg-gray-100 flex items-center justify-center'}`}
                style={project.image_url ? { backgroundImage: `url(${project.image_url})` } : {}}>
                {!project.image_url && (
                  <span className="text-gray-400">无图片</span>
                )}
              </div>
              {project.is_featured && (
                <div className="absolute top-3 right-3 bg-yellow-500 text-white p-2 rounded-full">
                  <Star className="w-4 h-4" />
                </div>
              )}
            </div>
            <div className="p-5">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-gray-800">{project.title}</h3>
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                  {project.category}
                </span>
              </div>
              <p className="text-gray-500 text-sm mb-3 line-clamp-2">{project.description}</p>
              <div className="flex flex-wrap gap-1 mb-4">
                {project.tags.map((tag, index) => (
                  <span key={index} className="px-2 py-0.5 bg-blue-50 text-blue-600 text-xs rounded">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div className="flex gap-2">
                  {project.github_url && (
                    <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-700">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.09.682-.217.682-.483 0-.237-.008-.868-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.268 2.75 1.026A9.578 9.578 0 0112 6.844c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.026 2.747-1.026.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                      </svg>
                    </a>
                  )}
                  {project.demo_url && (
                    <a href={project.demo_url} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-700">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                      </svg>
                    </a>
                  )}
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleToggleFeatured(project)}
                    className={`p-2 rounded-lg transition-colors ${project.is_featured ? 'text-yellow-500 bg-yellow-50' : 'text-gray-400 hover:text-yellow-500'}`}
                  >
                    <Star className={`w-4 h-4 ${project.is_featured ? 'fill-current' : ''}`} />
                  </button>
                  <button
                    onClick={() => handleEdit(project)}
                    className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(project.id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">
                {editingProject?.id ? '编辑项目' : '添加项目'}
              </h2>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingProject(null);
                }}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <X className="w-5 h-5 text-gray-500 dark:text-gray-300" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">项目名称</label>
                  <input
                    type="text"
                    value={editingProject?.title || ''}
                    onChange={(e) => setEditingProject({ ...editingProject!, title: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">分类</label>
                  <input
                    type="text"
                    value={editingProject?.category || ''}
                    onChange={(e) => setEditingProject({ ...editingProject!, category: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">简短描述</label>
                <textarea
                  value={editingProject?.description || ''}
                  onChange={(e) => setEditingProject({ ...editingProject!, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">详细描述</label>
                <textarea
                  value={editingProject?.long_description || ''}
                  onChange={(e) => setEditingProject({ ...editingProject!, long_description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">项目图片</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-500 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      id="project-image"
                    />
                    <label htmlFor="project-image" className="flex flex-col items-center justify-center cursor-pointer">
                      {imagePreview ? (
                        <img src={imagePreview} alt="Preview" className="w-full h-32 object-cover rounded-lg" />
                      ) : (
                        <>
                          <ImageIcon className="w-12 h-12 text-gray-400 mb-2" />
                          <span className="text-sm text-gray-500">点击或拖拽上传图片</span>
                          <span className="text-xs text-gray-400 mt-1">支持 JPG、PNG、GIF 格式</span>
                        </>
                      )}
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">GitHub链接</label>
                  <input
                    type="url"
                    value={editingProject?.github_url || ''}
                    onChange={(e) => setEditingProject({ ...editingProject!, github_url: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">演示链接</label>
                <input
                  type="url"
                  value={editingProject?.demo_url || ''}
                  onChange={(e) => setEditingProject({ ...editingProject!, demo_url: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">标签（逗号分隔）</label>
                <input
                  type="text"
                  value={editingProject?.tags.join(', ') || ''}
                  onChange={(e) => setEditingProject({ ...editingProject!, tags: e.target.value.split(',').map((t: string) => t.trim()).filter(Boolean) })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="React, TypeScript, Next.js"
                />
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="is_featured"
                  checked={editingProject?.is_featured || false}
                  onChange={(e) => setEditingProject({ ...editingProject!, is_featured: e.target.checked })}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="is_featured" className="text-sm font-medium text-gray-700">设为精选项目</label>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                >
                  <Save className="w-5 h-5" />
                  保存
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingProject(null);
                    setSelectedImage(null);
                    setImagePreview(null);
                  }}
                  className="px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-lg transition-colors"
                >
                  取消
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
