import { apiClient } from '@/lib/api-client';
import type { User, CreateUserDTO, UpdateUserDTO, PaginatedResponse } from '@/types';

/**
 * Users Service
 *
 * Type-safe API functions for user operations
 * Use with TanStack Query for caching and state management
 */

interface GetUsersParams {
  page?: number;
  pageSize?: number;
  search?: string;
  role?: string;
}

export const usersService = {
  /**
   * Get paginated list of users
   */
  getAll: (params?: GetUsersParams) =>
    apiClient.get<PaginatedResponse<User>>('/users', {
      params: params as Record<string, string | number>,
    }),

  /**
   * Get single user by ID
   */
  getById: (id: string) =>
    apiClient.get<User>(`/users/${id}`),

  /**
   * Create a new user
   */
  create: (data: CreateUserDTO) =>
    apiClient.post<User>('/users', data),

  /**
   * Update an existing user
   */
  update: (id: string, data: UpdateUserDTO) =>
    apiClient.patch<User>(`/users/${id}`, data),

  /**
   * Delete a user
   */
  delete: (id: string) =>
    apiClient.delete<void>(`/users/${id}`),

  /**
   * Get current authenticated user
   */
  getCurrentUser: () =>
    apiClient.get<User>('/users/me'),

  /**
   * Update current user's profile
   */
  updateProfile: (data: UpdateUserDTO) =>
    apiClient.patch<User>('/users/me', data),
};
