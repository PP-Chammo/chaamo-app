import { renderHook, act } from '@testing-library/react-native';

import { useAuthStore } from '../useAuthStore';

jest.mock('expo-router', () => ({
  router: { replace: jest.fn() },
}));

const { router } = require('expo-router');

describe('useAuthStore', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useAuthStore());
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('should sign in and navigate to home', () => {
    const { result } = renderHook(() => useAuthStore());
    act(() => {
      result.current.signIn();
    });
    expect(result.current.isAuthenticated).toBe(true);
    expect(router.replace).toHaveBeenCalledWith('/(tabs)/home');
  });

  it('should sign out and navigate to sign-in', () => {
    const { result } = renderHook(() => useAuthStore());
    act(() => {
      result.current.signOut();
    });
    expect(result.current.isAuthenticated).toBe(false);
    expect(router.replace).toHaveBeenCalledWith('/(auth)/sign-in');
  });
});
