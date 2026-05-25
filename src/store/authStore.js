import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api } from '../services/api';

// // TIEMPO DE SESIÓN: 1 minuto (60,000 milisegundos) para pruebas. 
// // Luego puedes cambiarlo a 15 * 60 * 1000 para 15 minutos.

const SESSION_DURATION_MS = 60 * 60 * 1000;

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      expiresAt: null,
      login: async (username, password) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post('/auth/login', { username, password });
          const { token, ...userData } = response.data;

          const expirationTime = new Date().getTime() + SESSION_DURATION_MS;

          set({
            user: userData,
            token: token,
            isAuthenticated: true,
            isLoading: false,
            expiresAt: expirationTime,
          });

          return true;
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error.response?.data?.message || 'Error al conectar con el servidor' 
          });
          return false;
        }
      },

      logout: () => set({ 
        user: null, 
        token: null, 
        isAuthenticated: false, 
        expiresAt: null 
      }),

      checkSession: () => {
        const { expiresAt, logout, isAuthenticated } = get();
        
        if (expiresAt && new Date().getTime() > expiresAt) {
          logout();
          return false; 
        }
        
        return isAuthenticated;
      }
    }),
    {
      name: 'auth-storage',
    }
  )
);