'use client';

import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Save, X, ArrowUp, ArrowDown } from 'lucide-react';
import AdminLayout from '../../../components/admin/Layout';
import { apiRequest, ApiResponse, Skill } from '../../../lib/api';

export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [skillsRes, categoriesRes] = await Promise.all([
          apiRequest<Skill[]>('/api/skills', 'GET', undefined, false),
          apiRequest<string[]>('/api/skills/categories', 'GET', undefined, false),
        ]);
        setSkills(skillsRes.data);
        setCategories(categoriesRes.data);
      } catch (error) {
        console.error('Failed to fetch skills:', error);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  const filteredSkills = selectedCategory
    ? skills.filter((s) => s.category === selectedCategory)
    : skills;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSkill) return;

    try {
      if (editingSkill.id) {
        await apiRequest<Skill>(
          `/api/skills/${editingSkill.id}`,
          'PUT',
          editingSkill
        );
        setMessage('技能更新成功！');
      } else {
        await apiRequest<Skill>('/api/skills', 'POST', editingSkill);
        setMessage('技能创建成功！');
      }
      setShowForm(false);
      setEditingSkill(null);
      window.location.reload();
    } catch (error) {
      setMessage('操作失败，请重试');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('确定要删除这个技能吗？')) return;

    try {
      await apiRequest<{}>(`/api/skills/${id}`, 'DELETE');
      setSkills(skills.filter((s) => s.id !== id));
      setMessage('删除成功！');
    } catch (error) {
      setMessage('删除失败，请重试');
    }
  };

  const handleAdd = () => {
    const categorySkills = skills.filter(s => !selectedCategory || s.category === selectedCategory);
    const maxOrder = categorySkills.length > 0 ? Math.max(...categorySkills.map(s => s.order)) : 0;
    setEditingSkill({
      id: 0,
      name: '',
      category: selectedCategory || '',
      level: 50,
      icon: null,
      color: '',
      order: maxOrder + 1,
    });
    setShowForm(true);
  };

  const handleEdit = (skill: Skill) => {
    setEditingSkill({ ...skill });
    setShowForm(true);
  };

  const handleMoveUp = async (skill: Skill) => {
    const categorySkills = skills.filter(s => s.category === skill.category).sort((a, b) => a.order - b.order || a.id - b.id);
    const currentIndex = categorySkills.findIndex(s => s.id === skill.id);
    if (currentIndex > 0) {
      const prevSkill = categorySkills[currentIndex - 1];
      const newOrder = prevSkill.order - 1;
      try {
        await apiRequest<{}>('/api/skills/order', 'PUT', [
          { id: skill.id, order: newOrder }
        ]);
        window.location.reload();
      } catch (error) {
        setMessage('排序更新失败，请重试');
      }
    }
  };

  const handleMoveDown = async (skill: Skill) => {
    const categorySkills = skills.filter(s => s.category === skill.category).sort((a, b) => a.order - b.order || a.id - b.id);
    const currentIndex = categorySkills.findIndex(s => s.id === skill.id);
    if (currentIndex < categorySkills.length - 1) {
      const nextSkill = categorySkills[currentIndex + 1];
      const newOrder = nextSkill.order + 1;
      try {
        await apiRequest<{}>('/api/skills/order', 'PUT', [
          { id: skill.id, order: newOrder }
        ]);
        window.location.reload();
      } catch (error) {
        setMessage('排序更新失败，请重试');
      }
    }
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
          <h1 className="text-2xl font-bold text-gray-800">技能管理</h1>
          <p className="text-gray-500 mt-1">管理您的技能列表</p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          添加技能
        </button>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-lg ${message.includes('成功') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message}
        </div>
      )}

      <div className="mb-6 flex gap-2 flex-wrap">
        <button
          onClick={() => setSelectedCategory('')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            !selectedCategory
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          全部
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedCategory === cat
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">名称</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">分类</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">熟练度</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">排序</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">移动</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredSkills.map((skill) => (
                <tr key={skill.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${skill.color || 'bg-gray-200'}`}>
                        <span className="text-sm font-medium">{skill.name.charAt(0)}</span>
                      </div>
                      <span className="font-medium text-gray-800">{skill.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-sm rounded">{skill.category}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500"
                          style={{ width: `${skill.level}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600">{skill.level}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {skill.order}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleMoveUp(skill)}
                        className="p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700 rounded transition-colors"
                        title="上移"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleMoveDown(skill)}
                        className="p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700 rounded transition-colors"
                        title="下移"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEdit(skill)}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(skill.id)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">
                {editingSkill?.id ? '编辑技能' : '添加技能'}
              </h2>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingSkill(null);
                }}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <X className="w-5 h-5 text-gray-500 dark:text-gray-300" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">技能名称</label>
                <input
                  type="text"
                  value={editingSkill?.name || ''}
                  onChange={(e) => setEditingSkill({ ...editingSkill!, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">分类</label>
                <select
                  value={editingSkill?.category || ''}
                  onChange={(e) => setEditingSkill({ ...editingSkill!, category: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">选择分类</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">熟练度: {editingSkill?.level}%</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={editingSkill?.level || 50}
                  onChange={(e) => setEditingSkill({ ...editingSkill!, level: parseInt(e.target.value) })}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">颜色</label>
                <input
                  type="text"
                  value={editingSkill?.color || ''}
                  onChange={(e) => setEditingSkill({ ...editingSkill!, color: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="如: bg-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">排序值</label>
                <input
                  type="number"
                  min="0"
                  value={editingSkill?.order || 0}
                  onChange={(e) => setEditingSkill({ ...editingSkill!, order: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="排序值越小越靠前"
                />
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
                    setEditingSkill(null);
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
