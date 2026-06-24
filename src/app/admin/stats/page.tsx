'use client';

import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import AdminLayout from '../../../components/admin/Layout';
import { apiRequest, ApiResponse, Stat } from '../../../lib/api';

export default function StatsPage() {
  const [stats, setStats] = useState<Stat[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [editingStat, setEditingStat] = useState<Stat | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await apiRequest<Stat[]>('/api/stats', 'GET', undefined, false);
        setStats(response.data);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
      setLoading(false);
    };

    fetchStats();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStat) return;

    try {
      if (editingStat.id) {
        await apiRequest<Stat>(
          `/api/stats/${editingStat.id}`,
          'PUT',
          editingStat
        );
        setMessage('统计数据更新成功！');
      } else {
        await apiRequest<Stat>('/api/stats', 'POST', editingStat);
        setMessage('统计数据创建成功！');
      }
      setShowForm(false);
      setEditingStat(null);
      window.location.reload();
    } catch (error) {
      setMessage('操作失败，请重试');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('确定要删除这个统计数据吗？')) return;

    try {
      await apiRequest<{}>(`/api/stats/${id}`, 'DELETE');
      setStats(stats.filter((s) => s.id !== id));
      setMessage('删除成功！');
    } catch (error) {
      setMessage('删除失败，请重试');
    }
  };

  const handleAdd = () => {
    setEditingStat({
      id: 0,
      value: '',
      label: '',
      order: stats.length + 1,
    });
    setShowForm(true);
  };

  const handleEdit = (stat: Stat) => {
    setEditingStat({ ...stat });
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
          <h1 className="text-2xl font-bold text-gray-800">统计数据管理</h1>
          <p className="text-gray-500 mt-1">管理首页展示的统计数据</p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          添加统计数据
        </button>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-lg ${message.includes('成功') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.id}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow relative"
          >
            <div className="absolute top-4 right-4 flex gap-1">
              <button
                onClick={() => handleEdit(stat)}
                className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(stat.id)}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-gray-800 mb-2">{stat.value}</p>
              <p className="text-gray-500">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">
                {editingStat?.id ? '编辑统计数据' : '添加统计数据'}
              </h2>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingStat(null);
                }}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <X className="w-5 h-5 text-gray-500 dark:text-gray-300" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">数值</label>
                <input
                  type="text"
                  value={editingStat?.value || ''}
                  onChange={(e) => setEditingStat({ ...editingStat!, value: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="如: 5+"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">标签</label>
                <input
                  type="text"
                  value={editingStat?.label || ''}
                  onChange={(e) => setEditingStat({ ...editingStat!, label: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="如: 年开发经验"
                  required
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
                    setEditingStat(null);
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
