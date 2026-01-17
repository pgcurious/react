import { apiClient } from '@/lib/api-client';
import type { User, LoginFormData, RegisterFormData } from '@/types';

/**
 * Auth Service
 *
 * Authentication API functions
 */

interface AuthResponse {
  user: User;
  token: string;
  refreshToken?: string;
}

interface RefreshTokenResponse {
  token: string;
}

export const authService = {
  /**
   * Login with email and password
   */
  login: (credentials: LoginFormData) =>
    apiClient.post<AuthResponse>('/auth/login', credentials),

  /**
   * Register a new user
   */
  register: (data: RegisterFormData) =>
    apiClient.post<AuthResponse>('/auth/register', data),

  /**
   * Logout current user
   */
  logout: () =>
    apiClient.post<void>('/auth/logout'),

  /**
   * Refresh access token
   */
  refreshToken: (refreshToken: string) =>
    apiClient.post<RefreshTokenResponse>('/auth/refresh', { refreshToken }),

  /**
   * Request password reset email
   */
  forgotPassword: (email: string) =>
    apiClient.post<{ message: string }>('/auth/forgot-password', { email }),

  /**
   * Reset password with token
   */
  resetPassword: (token: string, password: string) =>
    apiClient.post<{ message: string }>('/auth/reset-password', {
      token,
      password,
    }),

  /**
   * Verify email with token
   */
  verifyEmail: (token: string) =>
    apiClient.post<{ message: string }>('/auth/verify-email', { token }),
};
