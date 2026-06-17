// HaliMad — Couche API centralisée vers le backend Express
// Toutes les requêtes passent par cette couche.
// Le token JWT est stocké dans localStorage sous la clé 'halimad.token'.

const API_BASE =
  typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_API_URL
    ? (import.meta as any).env.VITE_API_URL
    : 'http://localhost:3000';

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('halimad.token');
}

export function setToken(token: string | null) {
  if (typeof window === 'undefined') return;
  if (token) {
    localStorage.setItem('halimad.token', token);
  } else {
    localStorage.removeItem('halimad.token');
  }
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
  formData?: FormData,
): Promise<T> {
  const headers: Record<string, string> = {};
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (body && !formData) headers['Content-Type'] = 'application/json';

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: formData ?? (body ? JSON.stringify(body) : undefined),
    credentials: 'include',
  });

  if (!res.ok) {
    let err;
    try {
      err = await res.json();
    } catch {
      err = { message: `HTTP ${res.status}` };
    }
    throw new Error(err?.message ?? `HTTP ${res.status}`);
  }

  return res.json() as Promise<T>;
}

// =========================================================================
// Auth
// =========================================================================
export interface ApiUser {
  id: string;
  email: string;
  name: string;
  whatsapp?: string;
  city: string;
  role: 'admin' | 'restaurant' | 'ambassadeur' | 'livreur' | 'client';
  status: 'en_attente' | 'approuve' | 'suspendu';
}

export interface AuthResponse {
  token: string;
  user: ApiUser;
}

export const api = {
  auth: {
    async signUp(opts: { email: string; password: string; name: string; whatsapp?: string; role?: string }): Promise<AuthResponse> {
      return request('POST', '/api/auth/signup', opts);
    },
    async signIn(email: string, password: string): Promise<AuthResponse> {
      return request('POST', '/api/auth/login', { email, password });
    },
    async me(): Promise<{ user: ApiUser }> {
      return request('GET', '/api/auth/me');
    },
  },

  // =========================================================================
  // Restaurants
  // =========================================================================
  restaurants: {
    async list(): Promise<any[]> {
      return request('GET', '/api/restaurants');
    },
    async get(id: string): Promise<any> {
      return request('GET', `/api/restaurants/${id}`);
    },
    async create(body: any): Promise<any> {
      return request('POST', '/api/restaurants', body);
    },
    async update(id: string, body: any): Promise<any> {
      return request('PUT', `/api/restaurants/${id}`, body);
    },
    async delete(id: string): Promise<void> {
      return request('DELETE', `/api/restaurants/${id}`);
    },
  },

  // =========================================================================
  // Dishes
  // =========================================================================
  dishes: {
    async list(): Promise<any[]> {
      return request('GET', '/api/dishes');
    },
    async create(body: any): Promise<any> {
      return request('POST', '/api/dishes', body);
    },
    async update(id: string, body: any): Promise<any> {
      return request('PUT', `/api/dishes/${id}`, body);
    },
    async delete(id: string): Promise<void> {
      return request('DELETE', `/api/dishes/${id}`);
    },
  },

  // =========================================================================
  // Orders
  // =========================================================================
  orders: {
    async list(): Promise<any[]> {
      return request('GET', '/api/orders');
    },
    async create(body: any): Promise<any> {
      return request('POST', '/api/orders', body);
    },
    async update(id: string, body: any): Promise<any> {
      return request('PATCH', `/api/orders/${id}`, body);
    },
  },

  // =========================================================================
  // Settings
  // =========================================================================
  settings: {
    async get(): Promise<any> {
      return request('GET', '/api/settings');
    },
    async update(body: any): Promise<any> {
      return request('PUT', '/api/settings', body);
    },
  },

  // =========================================================================
  // Users (admin)
  // =========================================================================
  users: {
    async list(): Promise<any[]> {
      return request('GET', '/api/users');
    },
    async create(body: any): Promise<any> {
      return request('POST', '/api/users', body);
    },
    async update(id: string, body: { role?: string; status?: string }): Promise<any> {
      return request('PATCH', `/api/users/${id}`, body);
    },
  },

  // =========================================================================
  // Storage
  // =========================================================================
  storage: {
    async upload(file: File): Promise<{ url: string }> {
      const fd = new FormData();
      fd.append('file', file);
      return request('POST', '/api/storage/upload', undefined, fd);
    },
  },
};
