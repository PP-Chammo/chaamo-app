import { create } from 'zustand';
import { router } from 'expo-router';

import { AuthStore, authStore } from '@/stores/authStore';

interface AuthState extends AuthStore {
  signIn: () => void;
  signOut: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  ...authStore,
  signIn: () => {
    set({ isAuthenticated: true });
    router.replace('/(tabs)/home');
  },
  signOut: () => {
    set({ isAuthenticated: false });
    router.replace('/(auth)/sign-in');
  },
}));
