import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authApi } from '@/lib/api';

interface AuthResponse {
  token: string;
  user: {
    id: string;
    username: string;
    email: string;
    stats: {
      matchesPlayed: number;
      wins: number;
      losses: number;
      winRate: number;
      globalRank: number;
    };
  };
  message?: string;
}

interface AuthState {
  token: string | null;
  user: any | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        try {
          set({ isLoading: true, error: null });

          if (!email || !password) {
            throw new Error('Please provide both email and password');
          }

          const response = await authApi.login({ email, password });
          
          if (!response || typeof response !== 'object') {
            throw new Error('Invalid response from server');
          }

          const { token, user, message } = response as AuthResponse;
          
          if (!token || !user) {
            throw new Error(message || 'Invalid response from server');
          }

          // Validate user object structure
          if (!user.id || !user.username || !user.email) {
            throw new Error('Invalid user data received');
          }

          set({
            token,
            user,
            isLoading: false,
            error: null
          });

          // Save token to localStorage for persistence
          if (typeof window !== 'undefined') {
            localStorage.setItem('auth-token', token);
          }

        } catch (error: any) {
          console.error('Login error:', error);
          set({
            error: error.message || 'Login failed',
            isLoading: false,
            token: null,
            user: null,
          });
          throw error;
        }
      },

      register: async (username: string, email: string, password: string) => {
        try {
          set({ isLoading: true, error: null });

          if (!username || !email || !password) {
            throw new Error('Please provide all required fields');
          }

          if (password.length < 6) {
            throw new Error('Password must be at least 6 characters long');
          }

          const response = await authApi.register({ username, email, password }) as AuthResponse;
          
          if (!response.token || !response.user) {
            throw new Error('Invalid response from server');
          }

          set({
            token: response.token,
            user: response.user,
            isLoading: false,
          });
        } catch (error: any) {
          set({
            error: error.message || 'Registration failed',
            isLoading: false,
          });
          throw error;
        }
      },

      logout: () => {
        set({ token: null, user: null, error: null });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);