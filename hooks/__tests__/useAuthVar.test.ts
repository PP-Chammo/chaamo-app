import { act, renderHook } from '@testing-library/react-native';
import { router } from 'expo-router';

import { useAuthVar } from '../useAuthVar';

jest.mock('expo-router', () => ({
  router: { replace: jest.fn() },
}));

describe('useAuthVar', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useAuthVar());
    const [authState] = result.current;
    expect(authState.isAuthenticated).toBe(false);
  });

  it('should sign in and navigate to home', () => {
    const { result } = renderHook(() => useAuthVar());
    const [, setAuthVar] = result.current;
    act(() => {
      setAuthVar({ signIn: true });
    });
    const [authState] = result.current;
    expect(authState.isAuthenticated).toBe(true);
    expect(router.replace).toHaveBeenCalledWith('/(tabs)/home');
  });

  it('should sign out and navigate to sign-in', () => {
    const { result } = renderHook(() => useAuthVar());
    const [, setAuthVar] = result.current;
    act(() => {
      setAuthVar({ signOut: true });
    });
    const [authState] = result.current;
    expect(authState.isAuthenticated).toBe(false);
    expect(router.replace).toHaveBeenCalledWith('/(auth)/sign-in');
  });
});
