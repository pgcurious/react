import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { User } from '@/types';

/**
 * Auth Store with Zustand
 *
 * Modern patterns demonstrated:
 * 1. Zustand for simple global state
 * 2. Persist middleware for localStorage
 * 3. Type-safe store with TypeScript
 * 4. Separated actions and selectors
 */

interface AuthState {
  // State
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;

  // Actions
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      // Initial state
      user: null,
      token: null,
      isAuthenticated: false,

      // Actions
      login: (user, token) =>
        set({
          user,
          token,
          isAuthenticated: true,
        }),

      logout: () =>
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        }),

      updateUser: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),
    }),
    {
      name: 'auth-storage', // localStorage key
      storage: createJSONStorage(() => localStorage),
      // Only persist certain fields
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// Selector hooks for optimized re-renders
const useUser = () => useAuthStore((state) => state.user);
const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated);
const useAuthActions = () =>
  useAuthStore((state) => ({
    login: state.login,
    logout: state.logout,
    updateUser: state.updateUser,
  }));

export { useAuthStore, useUser, useIsAuthenticated, useAuthActions };
