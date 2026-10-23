export const FALLBACK_API_URL = 'https://be-nugroho-adi.vercel.app/api';
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || FALLBACK_API_URL;

export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('admin_token');
}

export function setAuthToken(token: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('admin_token', token);
  }
}

export function removeAuthToken() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('admin_token');
  }

  export interface KnowledgeItem {
    id: number;
    content: string;
    metadata: {
      category: string;
      heading: string;
      title?: string;
      source?: string;
      embeddingModel?: string;
      embeddingDimension?: number;
    };
    created_at?: string;
  }
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getAuthToken();
  const headers = new Headers(options.headers || {});

  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });
  } catch (err: any) {
    // If connection to custom/local API_BASE_URL failed and it differs from fallback, retry against live backend
    if (API_BASE_URL !== FALLBACK_API_URL) {
      try {
        console.warn(`[API] Connection to ${API_BASE_URL} failed, retrying with ${FALLBACK_API_URL}...`);
        response = await fetch(`${FALLBACK_API_URL}${endpoint}`, {
          ...options,
          headers,
        });
      } catch (fallbackErr: any) {
        throw new Error(
          `Cannot connect to backend server (${API_BASE_URL} / ${FALLBACK_API_URL}). Please verify your backend is running or check internet connectivity.`
        );
      }
    } else {
      throw new Error(
        `Failed to connect to backend API (${API_BASE_URL}). Please check your internet connectivity.`
      );
    }
  }

  if (response.status === 401 && typeof window !== 'undefined') {
    removeAuthToken();
    if (!window.location.pathname.startsWith('/login')) {
      window.location.href = '/login';
    }
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const errorMsg =
      (data && (data.message || data.error)) ||
      `Request failed with status ${response.status}`;
    throw new Error(Array.isArray(errorMsg) ? errorMsg.join(', ') : errorMsg);
  }

  return data as T;
}

export const api = {
  // Auth
  auth: {
    login: (body: { email: string; password: string }) =>
      request<{ accessToken: string; email: string }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(body),
      }),
    getMe: () =>
      request<{ id: string; email: string; name: string; role: string }>(
        '/auth/me',
      ),
  },

  // Projects
  projects: {
    getAll: (params?: { category?: string; search?: string }) => {
      const q = new URLSearchParams();
      if (params?.category) q.append('category', params.category);
      if (params?.search) q.append('search', params.search);
      return request<any[]>(`/projects?${q.toString()}`);
    },
    getOne: (idOrSlug: string) => request<any>(`/projects/${idOrSlug}`),
    create: (data: any) =>
      request<any>('/projects', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (id: string, data: any) =>
      request<any>(`/projects/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      request<any>(`/projects/${id}`, {
        method: 'DELETE',
      }),
  },

  // Experiences
  experiences: {
    getAll: (params?: { search?: string }) => {
      const q = new URLSearchParams();
      if (params?.search) q.append('search', params.search);
      return request<any[]>(`/experiences?${q.toString()}`);
    },
    getOne: (idOrSlug: string) => request<any>(`/experiences/${idOrSlug}`),
    create: (data: any) =>
      request<any>('/experiences', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (id: string, data: any) =>
      request<any>(`/experiences/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      request<any>(`/experiences/${id}`, {
        method: 'DELETE',
      }),
  },

  // Achievements
  achievements: {
    getAll: (params?: { search?: string }) => {
      const q = new URLSearchParams();
      if (params?.search) q.append('search', params.search);
      return request<any[]>(`/achievements?${q.toString()}`);
    },
    getOne: (idOrSlug: string) => request<any>(`/achievements/${idOrSlug}`),
    create: (data: any) =>
      request<any>('/achievements', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (id: string, data: any) =>
      request<any>(`/achievements/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      request<any>(`/achievements/${id}`, {
        method: 'DELETE',
      }),
  },

  // Skills
  skills: {
    getAll: (params?: { category?: string; search?: string }) => {
      const q = new URLSearchParams();
      if (params?.category) q.append('category', params.category);
      if (params?.search) q.append('search', params.search);
      return request<any[]>(`/skills?${q.toString()}`);
    },
    create: (data: any) =>
      request<any>('/skills', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (id: string, data: any) =>
      request<any>(`/skills/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      request<any>(`/skills/${id}`, {
        method: 'DELETE',
      }),
  },

  // Messages
  messages: {
    getAll: (params?: { status?: string; search?: string }) => {
      const q = new URLSearchParams();
      if (params?.status) q.append('status', params.status);
      if (params?.search) q.append('search', params.search);
      return request<any[]>(`/messages?${q.toString()}`);
    },
    getOne: (id: string) => request<any>(`/messages/${id}`),
    update: (id: string, data: any) =>
      request<any>(`/messages/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      request<any>(`/messages/${id}`, {
        method: 'DELETE',
      }),
  },

  // Profile
  profile: {
    get: () => request<any>('/profile'),
    update: (data: any) =>
      request<any>('/profile', {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
  },

  knowledge: {
    getAll: () => request<KnowledgeItem[]>('/knowledge'),
    create: (data: {
      category: string;
      heading: string;
      content: string;
    }) => request<KnowledgeItem>('/knowledge', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    update: (
      id: number,
      data: { category: string; heading: string; content: string },
    ) => request<KnowledgeItem>(`/knowledge/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
    delete: (id: number) =>
      request<{ message: string; id: number }>(`/knowledge/${id}`, {
        method: 'DELETE',
      }),
    reindex: () =>
      request<{ count: number; model: string }>('/knowledge/reindex', {
        method: 'POST',
      }),
  },
};
