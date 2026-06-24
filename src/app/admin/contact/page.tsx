'use client';

import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Save, X, Mail, Phone, MapPin, Globe, Check } from 'lucide-react';
import AdminLayout from '../../../components/admin/Layout';
import { apiRequest, ApiResponse, ContactInfo, Message } from '../../../lib/api';

export default function ContactPage() {
  const [contactInfo, setContactInfo] = useState<ContactInfo[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [editingContact, setEditingContact] = useState<ContactInfo | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | 'messages'>('info');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [infoRes, messagesRes] = await Promise.all([
          apiRequest<ContactInfo[]>('/api/contact/info', 'GET', undefined, false),
          apiRequest<Message[]>('/api/contact/messages'),
        ]);
        setContactInfo(infoRes.data);
        setMessages(messagesRes.data);
      } catch (error) {
        console.error('Failed to fetch contact data:', error);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingContact) return;

    try {
      if (editingContact.id) {
        await apiRequest<ContactInfo>(
          `/api/contact/info/${editingContact.id}`,
          'PUT',
          editingContact
        );
        setMessage('联系信息更新成功！');
      } else {
        await apiRequest<ContactInfo>('/api/contact/info', 'POST', editingContact);
        setMessage('联系信息创建成功！');
      }
      setShowForm(false);
      setEditingContact(null);
      window.location.reload();
    } catch (error) {
      setMessage('操作失败，请重试');
    }
  };

  const handleDeleteContact = async (id: number) => {
    if (!confirm('确定要删除这个联系信息吗？')) return;

    try {
      await apiRequest<{}>(`/api/contact/info/${id}`, 'DELETE');
      setContactInfo(contactInfo.filter((c) => c.id !== id));
      setMessage('删除成功！');
    } catch (error) {
      setMessage('删除失败，请重试');
    }
  };

  const handleMarkRead = async (id: number) => {
    try {
      await apiRequest<{}>(`/api/contact/messages/${id}/read`, 'PUT');
      setMessages(messages.map((m) =>
        m.id === id ? { ...m, is_read: true } : m
      ));
      setMessage('已标记为已读');
    } catch (error) {
      setMessage('操作失败，请重试');
    }
  };

  const handleDeleteMessage = async (id: number) => {
    if (!confirm('确定要删除这条消息吗？')) return;

    try {
      await apiRequest<{}>(`/api/contact/messages/${id}`, 'DELETE');
      setMessages(messages.filter((m) => m.id !== id));
      setMessage('删除成功！');
    } catch (error) {
      setMessage('删除失败，请重试');
    }
  };

  const handleAdd = () => {
    setEditingContact({
      id: 0,
      type: '',
      content: '',
      link: '',
      is_active: true,
      order: 0,
    });
    setShowForm(true);
  };

  const handleEdit = (contact: ContactInfo) => {
    setEditingContact({ ...contact });
    setShowForm(true);
  };

  const getTypeIcon = (type: string) => {
    const icons: Record<string, React.ReactNode> = {
      email: <Mail className="w-5 h-5" />,
      phone: <Phone className="w-5 h-5" />,
      address: <MapPin className="w-5 h-5" />,
      social: <Globe className="w-5 h-5" />,
    };
    return icons[type] || <Globe className="w-5 h-5" />;
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      email: '邮箱',
      phone: '电话',
      address: '地址',
      social: '社交',
    };
    return labels[type] || type;
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
        <h1 className="text-2xl font-bold text-gray-800">联系信息管理</h1>
        <p className="text-gray-500 mt-1">管理您的联系信息和消息</p>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-lg ${message.includes('成功') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message}
        </div>
      )}

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab('info')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'info'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          联系信息
        </button>
        <button
          onClick={() => setActiveTab('messages')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors relative ${
            activeTab === 'messages'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          消息 ({messages.filter((m) => !m.is_read).length})
        </button>
      </div>

      {activeTab === 'info' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {contactInfo.map((contact) => (
              <div
                key={contact.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      contact.type === 'email' ? 'bg-blue-100 text-blue-600' :
                      contact.type === 'phone' ? 'bg-green-100 text-green-600' :
                      contact.type === 'address' ? 'bg-orange-100 text-orange-600' :
                      'bg-purple-100 text-purple-600'
                    }`}>
                      {getTypeIcon(contact.type)}
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">{getTypeLabel(contact.type)}</span>
                      <p className="font-medium text-gray-800">{contact.content}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleEdit(contact)}
                      className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteContact(contact.id)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                {contact.link && (
                  <a href={contact.link} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline mt-3 block">
                    {contact.link}
                  </a>
                )}
              </div>
            ))}
          </div>

          <button
            onClick={handleAdd}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
            添加联系信息
          </button>
        </>
      )}

      {activeTab === 'messages' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="divide-y divide-gray-100">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`px-6 py-4 ${msg.is_read ? 'bg-white' : 'bg-blue-50'}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-medium text-gray-800">{msg.name}</h3>
                      {!msg.is_read && (
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">{msg.email}</p>
                    {msg.subject && (
                      <p className="text-sm font-medium text-gray-700 mt-1">{msg.subject}</p>
                    )}
                    <p className="text-sm text-gray-600 mt-2">{msg.content}</p>
                    <p className="text-xs text-gray-400 mt-2">
                      {new Date(msg.created_at).toLocaleString('zh-CN')}
                    </p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    {!msg.is_read && (
                      <button
                        onClick={() => handleMarkRead(msg.id)}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                        title="标记已读"
                      >
                        <Check className="w-5 h-5" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteMessage(msg.id)}
                      className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                      title="删除"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {messages.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              暂无消息
            </div>
          )}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">
                {editingContact?.id ? '编辑联系信息' : '添加联系信息'}
              </h2>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingContact(null);
                }}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <X className="w-5 h-5 text-gray-500 dark:text-gray-300" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">类型</label>
                <select
                  value={editingContact?.type || ''}
                  onChange={(e) => setEditingContact({ ...editingContact!, type: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">选择类型</option>
                  <option value="email">邮箱</option>
                  <option value="phone">电话</option>
                  <option value="address">地址</option>
                  <option value="social">社交</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">内容</label>
                <input
                  type="text"
                  value={editingContact?.content || ''}
                  onChange={(e) => setEditingContact({ ...editingContact!, content: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">链接（可选）</label>
                <input
                  type="url"
                  value={editingContact?.link || ''}
                  onChange={(e) => setEditingContact({ ...editingContact!, link: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    setEditingContact(null);
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
