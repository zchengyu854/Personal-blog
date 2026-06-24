const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

export async function apiRequest<T>(
  endpoint: string,
  method: string = 'GET',
  body?: unknown,
  requiresAuth: boolean = true
): Promise<ApiResponse<T>> {
  const headers: Record<string, string> = {};
  let bodyData: BodyInit | undefined;

  if (body instanceof FormData) {
    bodyData = body;
  } else {
    headers['Content-Type'] = 'application/json';
    bodyData = body ? JSON.stringify(body) : undefined;
  }

  if (requiresAuth) {
    const token = localStorage.getItem('access_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  const token = localStorage.getItem('access_token');
  console.log('API Request:', { method, url: `${API_BASE_URL}${endpoint}`, hasToken: !!token, tokenLength: token?.length, headers: { ...headers }, hasBody: !!bodyData });
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers,
    body: bodyData,
  });

  console.log('API Response:', { status: response.status, ok: response.ok });
  
  if (!response.ok) {
    let errorText = '';
    try {
      const errorJson = await response.json();
      console.error('API Error Response:', { status: response.status, data: errorJson });
      errorText = errorJson.message || JSON.stringify(errorJson);
    } catch {
      errorText = await response.text();
      console.error('API Error:', { status: response.status, text: errorText });
    }
    if (response.status === 401) {
      localStorage.removeItem('access_token');
      window.location.href = '/admin/login';
    }
    throw new Error(errorText || `API request failed: ${response.status}`);
  }

  const data = await response.json();
  return data as ApiResponse<T>;
}

export async function apiRequestNoAuth<T>(
  endpoint: string,
  method: string = 'GET',
  body?: unknown
): Promise<ApiResponse<T>> {
  return apiRequest<T>(endpoint, method, body, false);
}

export interface ApiResponse<T = unknown> {
  code: number;
  message: string;
  data: T;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

export interface HeroData {
  title: string;
  title_en?: string;
  subtitle: string;
  subtitle_en?: string;
  description: string;
  description_en?: string;
  badge_text: string;
  badge_text_en?: string;
  buttons: Array<{ text: string; link: string; type: string }>;
}

export interface Skill {
  id: number;
  name: string;
  category: string;
  level: number;
  icon: string | null;
  color: string | null;
  order: number;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  long_description: string | null;
  category: string;
  image_url: string | null;
  github_url: string | null;
  demo_url: string | null;
  tags: string[];
  is_featured: boolean;
  order: number;
  created_at: string;
  updated_at: string;
}

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  read_time: number;
  cover_image: string | null;
  is_published: boolean;
  view_count: number;
  created_at: string;
  updated_at: string;
}

export interface ContactInfo {
  id: number;
  type: string;
  content: string;
  link: string | null;
  is_active: boolean;
  order: number;
}

export interface Message {
  id: number;
  name: string;
  email: string;
  subject: string | null;
  content: string;
  is_read: boolean;
  created_at: string;
}

export interface Stat {
  id: number;
  value: string;
  label: string;
  order: number;
}

export interface Experience {
  id: number;
  type: string;
  title: string;
  company: string | null;
  school: string | null;
  year: string | null;
  description: string | null;
  order: number;
}

export interface AboutProfile {
  id: number;
  title: string;
  content: string;
  avatar_url: string | null;
}

export interface Achievement {
  id: number;
  year: string | null;
  title: string;
  description: string | null;
  order: number;
}

export async function getHero(lang?: string): Promise<HeroData> {
  const url = lang ? `/api/hero?lang=${encodeURIComponent(lang)}` : '/api/hero';
  const response = await apiRequestNoAuth<HeroData>(url);
  return response.data;
}

export async function getStats(): Promise<Stat[]> {
  const response = await apiRequestNoAuth<Stat[]>('/api/stats');
  return response.data;
}

export async function getProjects(): Promise<{
  items: Project[];
  total: number;
  page: number;
  size: number;
}> {
  const response = await apiRequestNoAuth<{
    items: Project[];
    total: number;
    page: number;
    size: number;
  }>('/api/projects');
  return response.data;
}

export async function getFeaturedProjects(): Promise<Project[]> {
  const response = await apiRequestNoAuth<Project[]>('/api/projects/featured');
  return response.data;
}

export async function getSkills(category?: string): Promise<Skill[]> {
  const url = category ? `/api/skills?category=${encodeURIComponent(category)}` : '/api/skills';
  const response = await apiRequestNoAuth<Skill[]>(url);
  return response.data;
}

export async function getSkillCategories(): Promise<string[]> {
  const response = await apiRequestNoAuth<string[]>('/api/skills/categories');
  return response.data;
}

export async function getBlogPosts(): Promise<{
  items: BlogPost[];
  total: number;
  page: number;
  size: number;
}> {
  const response = await apiRequestNoAuth<{
    items: BlogPost[];
    total: number;
    page: number;
    size: number;
  }>('/api/blog/posts?is_published=true');
  return response.data;
}

export async function getLatestBlogPosts(): Promise<BlogPost[]> {
  const response = await apiRequestNoAuth<BlogPost[]>('/api/blog/posts/latest');
  return response.data;
}

export async function getAboutProfile(): Promise<AboutProfile> {
  const response = await apiRequestNoAuth<AboutProfile>('/api/about/profile');
  return response.data;
}

export async function getExperiences(): Promise<Experience[]> {
  const response = await apiRequestNoAuth<Experience[]>('/api/about/experiences');
  return response.data;
}

export async function getEducation(): Promise<Experience[]> {
  const response = await apiRequestNoAuth<Experience[]>('/api/about/education');
  return response.data;
}

export async function getAchievements(): Promise<Achievement[]> {
  const response = await apiRequestNoAuth<Achievement[]>('/api/about/achievements');
  return response.data;
}

export async function getContactInfo(): Promise<ContactInfo[]> {
  const response = await apiRequestNoAuth<ContactInfo[]>('/api/contact/info');
  return response.data;
}

export async function submitContactMessage(message: {
  name: string;
  email: string;
  subject?: string;
  content: string;
}): Promise<void> {
  await apiRequestNoAuth('/api/contact/message', 'POST', message);
}
