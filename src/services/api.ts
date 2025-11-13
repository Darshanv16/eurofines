import { UserRole } from '../types/auth';

const API_BASE_URL = (import.meta.env.VITE_API_URL as string) || 'http://localhost:3001/api';

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

export interface AuthUser {
  id: number;
  email: string;
  role: UserRole;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

class ApiService {
  private getAuthToken(): string | null {
    return localStorage.getItem('token');
  }

  private buildHeaders(extra?: HeadersInit): Record<string, string> {
  const token = this.getAuthToken();

  // Always return a plain object
  const result: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (extra) {
    if (extra instanceof Headers) {
      extra.forEach((value, key) => {
        result[key] = value;
      });
    } else if (Array.isArray(extra)) {
      for (const [key, value] of extra) {
        result[key] = value;
      }
    } else {
      Object.assign(result, extra);
    }
  }

  if (token) {
    result["Authorization"] = `Bearer ${token}`;
  }

  return result;
}

  private normalizeResponseBody<T>(parsed: any): T {
    if (!parsed) return parsed;
    if (typeof parsed === 'object' && !Array.isArray(parsed)) {
      const keys = Object.keys(parsed);
      if (keys.length === 1) {
        const k = keys[0];
        if (
          [
            'user',
            'token',
            'test_item',
            'test_items',
            'study',
            'studies',
            'facility_doc',
            'facility_docs',
            'data',
            'result',
            'items',
          ].includes(k)
        ) {
          return parsed[k] as T;
        }
      }
    }
    return parsed as T;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = this.buildHeaders(options.headers || {});
    try {
      const response = await fetch(url, { ...options, headers });

      // read text first to avoid JSON parse errors
      const text = await response.text();

      // handle empty body
      if (!text) {
        if (!response.ok) {
          return { error: `Error: ${response.status} ${response.statusText}` };
        }
        return { data: undefined };
      }

      // try parse JSON
      let parsed: any;
      try {
        parsed = JSON.parse(text);
      } catch (err) {
        if (!response.ok) {
          return { error: text || `Error: ${response.status} ${response.statusText}` };
        }
        return { error: 'Invalid JSON response from server' };
      }

      if (!response.ok) {
        const errMsg = parsed?.error || parsed?.message || parsed?.detail || `Error: ${response.status} ${response.statusText}`;
        return { error: errMsg };
      }

      const data = this.normalizeResponseBody<T>(parsed);
      return { data };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Network error';
      if (message.includes('Failed to fetch') || message.includes('NetworkError')) {
        return { error: 'Cannot connect to server. Please make sure the backend server is running on http://localhost:3001' };
      }
      return { error: message };
    }
  }

  // Auth endpoints
  async signup(email: string, password: string, role: 'user' | 'admin') {
    return this.request<AuthResponse>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, role }),
    });
  }

  async signin(email: string, password: string) {
    return this.request<AuthResponse>('/auth/signin', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async getCurrentUser() {
    return this.request<AuthUser>('/auth/me');
  }

  // Test Items endpoints
  async getTestItems(entity?: string) {
    const query = entity ? `?entity=${encodeURIComponent(entity)}` : '';
    return this.request<any[]>(`/test-items${query}`);
  }

  async getTestItem(id: number) {
    return this.request<any>(`/test-items/${id}`);
  }

  async createTestItem(data: any) {
    return this.request<any>('/test-items', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateTestItem(id: number, data: any) {
    return this.request<any>(`/test-items/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteTestItem(id: number) {
    return this.request<void>(`/test-items/${id}`, { method: 'DELETE' });
  }

  // Studies endpoints
  async getStudies(entity?: string) {
    const query = entity ? `?entity=${encodeURIComponent(entity)}` : '';
    return this.request<any[]>(`/studies${query}`);
  }

  async getStudy(id: number) {
    return this.request<any>(`/studies/${id}`);
  }

  async createStudy(data: any) {
    return this.request<any>('/studies', { method: 'POST', body: JSON.stringify(data) });
  }

  async updateStudy(id: number, data: any) {
    return this.request<any>(`/studies/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  }

  async deleteStudy(id: number) {
    return this.request<void>(`/studies/${id}`, { method: 'DELETE' });
  }

  // Facility Docs endpoints
  async getFacilityDocs(entity?: string) {
    const query = entity ? `?entity=${encodeURIComponent(entity)}` : '';
    return this.request<any[]>(`/facility-docs${query}`);
  }

  async getFacilityDoc(id: number) {
    return this.request<any>(`/facility-docs/${id}`);
  }

  async createFacilityDoc(data: any) {
    return this.request<any>('/facility-docs', { method: 'POST', body: JSON.stringify(data) });
  }

  async updateFacilityDoc(id: number, data: any) {
    return this.request<any>(`/facility-docs/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  }

  async deleteFacilityDoc(id: number) {
    return this.request<void>(`/facility-docs/${id}`, { method: 'DELETE' });
  }
}

export const api = new ApiService();
export default api;
