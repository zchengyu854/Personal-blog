'use client';

import { useEffect, useState } from 'react';
import { Save, RotateCcw } from 'lucide-react';
import AdminLayout from '../../../components/admin/Layout';
import { apiRequest, ApiResponse, HeroData } from '../../../lib/api';

export default function HeroPage() {
  const [heroData, setHeroData] = useState<HeroData>({
    title: '',
    title_en: '',
    subtitle: '',
    subtitle_en: '',
    description: '',
    description_en: '',
    badge_text: '',
    badge_text_en: '',
    buttons: [],
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchHero = async () => {
      try {
        const response = await apiRequest<HeroData>('/api/hero', 'GET', undefined, false);
        setHeroData(response.data);
      } catch (error) {
        console.error('Failed to fetch hero data:', error);
      }
      setLoading(false);
    };

    fetchHero();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      await apiRequest<HeroData>('/api/hero', 'PUT', heroData);
      setMessage('更新成功！');
    } catch (error) {
      setMessage('更新失败，请重试');
    }

    setSaving(false);
  };

  const handleReset = () => {
    setHeroData({
      title: '',
      title_en: '',
      subtitle: '',
      subtitle_en: '',
      description: '',
      description_en: '',
      badge_text: '',
      badge_text_en: '',
      buttons: [],
    });
    setMessage('');
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
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Hero区域管理</h1>
        <p className="text-gray-500 mt-1">管理首页Hero区域的内容</p>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-lg ${message.includes('成功') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">主标题（中文）</label>
            <input
              type="text"
              value={heroData.title}
              onChange={(e) => setHeroData({ ...heroData, title: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="输入主标题"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">主标题（英文）</label>
            <input
              type="text"
              value={heroData.title_en}
              onChange={(e) => setHeroData({ ...heroData, title_en: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="输入英文主标题"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">副标题（中文）</label>
            <input
              type="text"
              value={heroData.subtitle}
              onChange={(e) => setHeroData({ ...heroData, subtitle: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="输入副标题"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">副标题（英文）</label>
            <input
              type="text"
              value={heroData.subtitle_en}
              onChange={(e) => setHeroData({ ...heroData, subtitle_en: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="输入英文副标题"
            />
          </div>

          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">描述（中文）</label>
            <textarea
              value={heroData.description}
              onChange={(e) => setHeroData({ ...heroData, description: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="输入描述内容"
            />
          </div>

          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">描述（英文）</label>
            <textarea
              value={heroData.description_en}
              onChange={(e) => setHeroData({ ...heroData, description_en: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="输入英文描述内容"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">标签文本（中文）</label>
            <input
              type="text"
              value={heroData.badge_text}
              onChange={(e) => setHeroData({ ...heroData, badge_text: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="输入标签文本"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">标签文本（英文）</label>
            <input
              type="text"
              value={heroData.badge_text_en}
              onChange={(e) => setHeroData({ ...heroData, badge_text_en: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="输入英文标签文本"
            />
          </div>
        </div>

        <div className="mt-8 flex gap-4">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-500 text-white font-medium rounded-lg transition-colors"
          >
            <Save className="w-5 h-5" />
            {saving ? '保存中...' : '保存'}
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-2 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-lg transition-colors"
          >
            <RotateCcw className="w-5 h-5" />
            重置
          </button>
        </div>
      </form>

      <div className="mt-6 bg-gray-50 rounded-xl p-6">
        <h3 className="font-semibold text-gray-700 mb-4">预览</h3>
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          {heroData.badge_text && (
            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full mb-4">
              {heroData.badge_text}
            </span>
          )}
          <h2 className="text-3xl font-bold text-gray-800 mb-2">{heroData.title || '主标题'}</h2>
          <p className="text-xl text-gray-600 mb-4">{heroData.subtitle || '副标题'}</p>
          <p className="text-gray-500">{heroData.description || '描述内容...'}</p>
        </div>
      </div>
    </AdminLayout>
  );
}
