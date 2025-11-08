import { UserRole } from '../types/auth';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

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

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const token = this.getAuthToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });

      // Read response as text first, then parse as JSON
      const text = await response.text();
      let data;
      
      try {
        data = text ? JSON.parse(text) : {};
      } catch (jsonError) {
        // If JSON parsing fails, return the text as error message
        if (!response.ok) {
          return { error: text || `Error: ${response.status} ${response.statusText}` };
        }
        return { error: 'Invalid response format from server' };
      }

      if (!response.ok) {
        // Handle different error response formats
        const errorMessage = data?.error || data?.message || `Error: ${response.status} ${response.statusText}`;
        return { error: errorMessage };
      }

      return { data };
    } catch (error) {
      // Network error or fetch failed
      const errorMessage = error instanceof Error ? error.message : 'Network error';
      // Provide more helpful error message for common issues
      if (errorMessage.includes('Failed to fetch') || errorMessage.includes('NetworkError')) {
        return { error: 'Cannot connect to server. Please make sure the backend server is running on http://localhost:3001' };
      }
      return { error: errorMessage };
    }
  }

  // Auth endpoints
  async signup(email: string, password: string, role: 'user' | 'admin') {
    return this.request<AuthResponse>(
      '/auth/signup',
      {
        method: 'POST',
        body: JSON.stringify({ email, password, role }),
      }
    );
  }

  async signin(email: string, password: string) {
    return this.request<AuthResponse>(
      '/auth/signin',
      {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }
    );
  }

  async getCurrentUser() {
    return this.request<AuthUser>('/auth/me');
  }

  // Test Items endpoints
  async getTestItems(entity?: string) {
    const query = entity ? `?entity=${entity}` : '';
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
    return this.request<void>(`/test-items/${id}`, {
      method: 'DELETE',
    });
  }

  // Studies endpoints
  async getStudies(entity?: string) {
    const query = entity ? `?entity=${entity}` : '';
    return this.request<any[]>(`/studies${query}`);
  }

  async getStudy(id: number) {
    return this.request<any>(`/studies/${id}`);
  }

  async createStudy(data: any) {
    return this.request<any>('/studies', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateStudy(id: number, data: any) {
    return this.request<any>(`/studies/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteStudy(id: number) {
    return this.request<void>(`/studies/${id}`, {
      method: 'DELETE',
    });
  }

  // Facility Docs endpoints
  async getFacilityDocs(entity?: string) {
    const query = entity ? `?entity=${entity}` : '';
    return this.request<any[]>(`/facility-docs${query}`);
  }

  async getFacilityDoc(id: number) {
    return this.request<any>(`/facility-docs/${id}`);
  }

  async createFacilityDoc(data: any) {
    return this.request<any>('/facility-docs', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateFacilityDoc(id: number, data: any) {
    return this.request<any>(`/facility-docs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteFacilityDoc(id: number) {
    return this.request<void>(`/facility-docs/${id}`, {
      method: 'DELETE',
    });
  }
}

export const api = new ApiService();

