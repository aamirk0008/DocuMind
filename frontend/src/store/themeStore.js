import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useThemeStore = create(
  persist(
    (set, get) => ({
      theme: 'light',
      toggle: () => {
        const next = get().theme === 'light' ? 'dark' : 'light';
        document.documentElement.classList.toggle('dark', next === 'dark');
        set({ theme: next });
      },
      init: () => {
        const theme = get().theme;
        document.documentElement.classList.toggle('dark', theme === 'dark');
      },
    }),
    { name: 'theme-storage' }
  )
);

export default useThemeStore;