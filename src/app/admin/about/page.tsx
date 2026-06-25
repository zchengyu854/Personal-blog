'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X, Briefcase, GraduationCap, Award, User } from 'lucide-react';
import AdminLayout from '../../../components/admin/Layout';
import { apiRequest, ApiResponse, AboutProfile, Experience } from '../../../lib/api';

type ExperienceType = 'work' | 'education' | 'achievement';

export default function AboutPage() {
  const [profile, setProfile] = useState<AboutProfile | null>(null);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [education, setEducation] = useState<Experience[]>([]);
  const [achievements, setAchievements] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const [showProfileForm, setShowProfileForm] = useState(false);
  const [editingProfile, setEditingProfile] = useState<AboutProfile | null>(null);

  const [showExperienceForm, setShowExperienceForm] = useState(false);
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null);
  const [experienceType, setExperienceType] = useState<ExperienceType>('work');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, expRes, eduRes, achRes] = await Promise.all([
          apiRequest<AboutProfile>('/api/about/profile', 'GET', undefined, false),
          apiRequest<Experience[]>('/api/about/experiences', 'GET', undefined, false),
          apiRequest<Experience[]>('/api/about/education', 'GET', undefined, false),
          apiRequest<Experience[]>('/api/about/achievements', 'GET', undefined, false),
        ]);
        setProfile(profileRes.data);
        setExperiences(expRes.data);
        setEducation(eduRes.data);
        setAchievements(achRes.data);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProfile) return;

    try {
      await apiRequest<AboutProfile>(
        '/api/about/profile',
        'PUT',
        { title: editingProfile.title, content: editingProfile.content },
        true
      );
      setProfile(editingProfile);
      setShowProfileForm(false);
      setEditingProfile(null);
      setMessage('个人简介更新成功！');
    } catch (error) {
      setMessage('操作失败，请重试');
    }
  };

  const handleExperienceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingExperience) return;

    const data = {
      type: experienceType,
      title: editingExperience.title,
      year: editingExperience.year,
      description: editingExperience.description,
      order: editingExperience.order,
    };

    if (experienceType === 'work') {
      (data as any).company = editingExperience.company;
    } else if (experienceType === 'education') {
      (data as any).school = editingExperience.school;
    }

    try {
      if (editingExperience.id) {
        await apiRequest<Experience>(
          `/api/about/${experienceType}s/${editingExperience.id}`,
          'PUT',
          data,
          true
        );
        setMessage('更新成功！');
      } else {
        await apiRequest<Experience>(
          `/api/about/${experienceType}s`,
          'POST',
          data,
          true
        );
        setMessage('创建成功！');
      }
      setShowExperienceForm(false);
      setEditingExperience(null);
      window.location.reload();
    } catch (error) {
      setMessage('操作失败，请重试');
    }
  };

  const handleDeleteExperience = async (id: number, type: ExperienceType) => {
    if (!confirm('确定要删除吗？')) return;

    try {
      await apiRequest<{}>(`/api/about/${type}s/${id}`, 'DELETE');
      if (type === 'work') {
        setExperiences(experiences.filter(e => e.id !== id));
      } else if (type === 'education') {
        setEducation(education.filter(e => e.id !== id));
      } else {
        setAchievements(achievements.filter(e => e.id !== id));
      }
      setMessage('删除成功！');
    } catch (error) {
      setMessage('删除失败，请重试');
    }
  };

  const handleAddExperience = (type: ExperienceType) => {
    setExperienceType(type);
    setEditingExperience({
      id: 0,
      type,
      title: '',
      year: '',
      company: '',
      school: '',
      description: '',
      order: 0,
    });
    setShowExperienceForm(true);
  };

  const handleEditExperience = (exp: Experience, type: ExperienceType) => {
    setExperienceType(type);
    setEditingExperience({ ...exp });
    setShowExperienceForm(true);
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
          <h1 className="text-2xl font-bold text-gray-800">关于我管理</h1>
          <p className="text-gray-500 mt-1">管理个人简介、工作经历、教育背景和成就</p>
        </div>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-lg ${message.includes('成功') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message}
        </div>
      )}

      <div className="mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <User className="w-6 h-6 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-800">个人简介</h2>
            </div>
            <button
              onClick={() => {
                setEditingProfile(profile || { id: 0, title: '', content: '', avatar_url: '' });
                setShowProfileForm(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              <Edit2 className="w-4 h-4" />
              编辑
            </button>
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">{profile?.title || '个人简介'}</h3>
          <p className="text-gray-600 leading-relaxed whitespace-pre-line">{profile?.content || '暂无内容'}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 bg-blue-50 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-blue-600" />
              <h2 className="font-semibold text-gray-800">工作经历</h2>
            </div>
            <button
              onClick={() => handleAddExperience('work')}
              className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <div className="p-4 space-y-4">
            {experiences.length === 0 ? (
              <p className="text-gray-400 text-center py-8">暂无工作经历</p>
            ) : (
              experiences.map((exp) => (
                <div key={exp.id} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium text-gray-800">{exp.title}</h3>
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleEditExperience(exp, 'work')}
                        className="p-1 text-gray-400 hover:text-blue-500"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteExperience(exp.id, 'work')}
                        className="p-1 text-gray-400 hover:text-red-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-blue-600">{exp.company}</p>
                  <p className="text-sm text-gray-500">{exp.year}</p>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">{exp.description}</p>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 bg-green-50 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-green-600" />
              <h2 className="font-semibold text-gray-800">教育背景</h2>
            </div>
            <button
              onClick={() => handleAddExperience('education')}
              className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <div className="p-4 space-y-4">
            {education.length === 0 ? (
              <p className="text-gray-400 text-center py-8">暂无教育背景</p>
            ) : (
              education.map((exp) => (
                <div key={exp.id} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium text-gray-800">{exp.title}</h3>
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleEditExperience(exp, 'education')}
                        className="p-1 text-gray-400 hover:text-green-500"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteExperience(exp.id, 'education')}
                        className="p-1 text-gray-400 hover:text-red-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-green-600">{exp.school}</p>
                  <p className="text-sm text-gray-500">{exp.year}</p>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">{exp.description}</p>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 bg-yellow-50 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-600" />
              <h2 className="font-semibold text-gray-800">成就</h2>
            </div>
            <button
              onClick={() => handleAddExperience('achievement')}
              className="p-2 text-yellow-600 hover:bg-yellow-100 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <div className="p-4 space-y-4">
            {achievements.length === 0 ? (
              <p className="text-gray-400 text-center py-8">暂无成就</p>
            ) : (
              achievements.map((exp) => (
                <div key={exp.id} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium text-gray-800">{exp.title}</h3>
                    <button
                      onClick={() => handleDeleteExperience(exp.id, 'achievement')}
                      className="p-1 text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-sm text-gray-500">{exp.year}</p>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">{exp.description}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {showProfileForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">编辑个人简介</h2>
              <button
                onClick={() => {
                  setShowProfileForm(false);
                  setEditingProfile(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <form onSubmit={handleProfileSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">标题</label>
                <input
                  type="text"
                  value={editingProfile?.title || ''}
                  onChange={(e) => setEditingProfile({ ...editingProfile!, title: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">内容</label>
                <textarea
                  value={editingProfile?.content || ''}
                  onChange={(e) => setEditingProfile({ ...editingProfile!, content: e.target.value })}
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
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
                    setShowProfileForm(false);
                    setEditingProfile(null);
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

      {showExperienceForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">
                {experienceType === 'work' ? '工作经历' : experienceType === 'education' ? '教育背景' : '成就'}
              </h2>
              <button
                onClick={() => {
                  setShowExperienceForm(false);
                  setEditingExperience(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <form onSubmit={handleExperienceSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">标题</label>
                <input
                  type="text"
                  value={editingExperience?.title || ''}
                  onChange={(e) => setEditingExperience({ ...editingExperience!, title: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              {experienceType === 'work' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">公司</label>
                  <input
                    type="text"
                    value={editingExperience?.company || ''}
                    onChange={(e) => setEditingExperience({ ...editingExperience!, company: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              )}
              {experienceType === 'education' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">学校</label>
                  <input
                    type="text"
                    value={editingExperience?.school || ''}
                    onChange={(e) => setEditingExperience({ ...editingExperience!, school: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">年份</label>
                <input
                  type="text"
                  value={editingExperience?.year || ''}
                  onChange={(e) => setEditingExperience({ ...editingExperience!, year: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="例如：2020-2023"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">描述</label>
                <textarea
                  value={editingExperience?.description || ''}
                  onChange={(e) => setEditingExperience({ ...editingExperience!, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
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
                    setShowExperienceForm(false);
                    setEditingExperience(null);
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