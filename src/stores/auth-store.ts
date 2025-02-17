
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types/movies';

interface ProfileData {
  display_name: string | null;
  username: string | null;
}

interface AuthState {
  token: string | null;
  user: User | null;
  profileData: ProfileData | null;
  setAuth: (token: string, user: User) => void;
  setProfileData: (data: ProfileData) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      profileData: null,
      setAuth: (token, user) => set({ token, user }),
      setProfileData: (data) => set({ profileData: data }),
      clearAuth: () => set({ token: null, user: null, profileData: null }),
    }),
    {
      name: 'ekowest-auth',
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          return str ? JSON.parse(str) : null;
        },
        setItem: (name, value) => localStorage.setItem(name, JSON.stringify(value)),
        removeItem: (name) => localStorage.removeItem(name),
      },
    }
  )
);
