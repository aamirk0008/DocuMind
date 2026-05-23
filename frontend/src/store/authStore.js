import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../lib/api';

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      accessToken: null,

      login: async (email, password) => {
        const { data } = await api.post('/auth/login', { email, password });
        localStorage.setItem('accessToken', data.accessToken);
        set({ user: data.user, accessToken: data.accessToken });
      },

      register: async (name, email, password) => {
        const { data } = await api.post('/auth/register', { name, email, password });
        localStorage.setItem('accessToken', data.accessToken);
        set({ user: data.user, accessToken: data.accessToken });
      },

      logout: async () => {
        try { await api.post('/auth/logout'); } catch {}
        localStorage.removeItem('accessToken');
        set({ user: null, accessToken: null });
        window.location.href = '/auth';
      },
    }),
    { name: 'auth-storage', partialize: (s) => ({ user: s.user }) }
  )
);

export default useAuthStore;