import { router } from 'expo-router';

import { AuthStore, authStore } from '@/stores/authStore';
import { createReactiveVar } from '@/utils/reactive';

const authVar = createReactiveVar<AuthStore>(authStore);

function useAuthVar(): [
  AuthStore,
  (value: Partial<AuthStore> | { signIn?: true; signOut?: true }) => void,
] {
  const authState = authVar.useVar();
  const setAuthVar = (
    value: Partial<AuthStore> | { signIn?: true; signOut?: true },
  ) => {
    if ('signIn' in value && value.signIn) {
      authVar.set({ ...authState, isAuthenticated: true });
      router.replace('/(tabs)/home');
      return;
    }
    if ('signOut' in value && value.signOut) {
      authVar.set({ ...authState, isAuthenticated: false });
      router.replace('/(auth)/sign-in');
      return;
    }
    authVar.set({ ...authState, ...value });
  };
  return [authState, setAuthVar];
}

export { useAuthVar };
