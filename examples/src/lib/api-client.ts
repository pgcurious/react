/**
 * Type-Safe API Client
 *
 * Modern patterns demonstrated:
 * 1. Centralized API configuration
 * 2. Type-safe request/response handling
 * 3. Automatic error handling
 * 4. Request interceptors (auth tokens)
 * 5. Response interceptors (error handling)
 */

// Custom API Error class
export class APIError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    public data?: unknown
  ) {
    super(`API Error: ${status} ${statusText}`);
    this.name = 'APIError';
  }
}

// Request configuration
interface RequestConfig extends RequestInit {
  params?: Record<string, string | number | boolean>;
}

// API Client configuration
interface APIClientConfig {
  baseURL: string;
  getToken?: () => string | null;
  onUnauthorized?: () => void;
}

function createAPIClient(config: APIClientConfig) {
  const { baseURL, getToken, onUnauthorized } = config;

  async function request<T>(
    endpoint: string,
    options: RequestConfig = {}
  ): Promise<T> {
    const { params, ...fetchOptions } = options;

    // Build URL with query params
    let url = `${baseURL}${endpoint}`;
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        searchParams.append(key, String(value));
      });
      url += `?${searchParams.toString()}`;
    }

    // Build headers
    const headers = new Headers(fetchOptions.headers);
    headers.set('Content-Type', 'application/json');

    // Add auth token if available
    const token = getToken?.();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    // Make request
    const response = await fetch(url, {
      ...fetchOptions,
      headers,
    });

    // Handle errors
    if (!response.ok) {
      // Handle 401 specifically
      if (response.status === 401 && onUnauthorized) {
        onUnauthorized();
      }

      let errorData: unknown;
      try {
        errorData = await response.json();
      } catch {
        errorData = null;
      }

      throw new APIError(response.status, response.statusText, errorData);
    }

    // Handle 204 No Content
    if (response.status === 204) {
      return undefined as T;
    }

    return response.json() as Promise<T>;
  }

  return {
    get: <T>(endpoint: string, config?: RequestConfig) =>
      request<T>(endpoint, { ...config, method: 'GET' }),

    post: <T>(endpoint: string, data?: unknown, config?: RequestConfig) =>
      request<T>(endpoint, {
        ...config,
        method: 'POST',
        body: data ? JSON.stringify(data) : undefined,
      }),

    put: <T>(endpoint: string, data?: unknown, config?: RequestConfig) =>
      request<T>(endpoint, {
        ...config,
        method: 'PUT',
        body: data ? JSON.stringify(data) : undefined,
      }),

    patch: <T>(endpoint: string, data?: unknown, config?: RequestConfig) =>
      request<T>(endpoint, {
        ...config,
        method: 'PATCH',
        body: data ? JSON.stringify(data) : undefined,
      }),

    delete: <T>(endpoint: string, config?: RequestConfig) =>
      request<T>(endpoint, { ...config, method: 'DELETE' }),
  };
}

// Create default client instance
// In real app, read from environment variables
const apiClient = createAPIClient({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3001/api',
  getToken: () => {
    // Get token from auth store or localStorage
    const authData = localStorage.getItem('auth-storage');
    if (authData) {
      try {
        const parsed = JSON.parse(authData);
        return parsed.state?.token ?? null;
      } catch {
        return null;
      }
    }
    return null;
  },
  onUnauthorized: () => {
    // Clear auth state and redirect to login
    localStorage.removeItem('auth-storage');
    window.location.href = '/login';
  },
});

export { createAPIClient, apiClient };
