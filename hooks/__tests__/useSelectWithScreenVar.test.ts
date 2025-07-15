import { act, renderHook } from '@testing-library/react-native';
import { router } from 'expo-router';

import { useSelectWithScreenVar } from '../useSelectWithScreenVar';

jest.mock('expo-router', () => ({
  router: { back: jest.fn() },
}));

describe('useSelectWithScreenVar', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useSelectWithScreenVar());
    const [state] = result.current;
    expect(state.selectedCountry).toBe('');
    expect(state.selectedState).toBe('');
  });

  it('should set selected country and navigate back', () => {
    const { result } = renderHook(() => useSelectWithScreenVar());
    const [, setVar] = result.current;
    act(() => {
      setVar({ selectedCountry: 'USA' });
    });
    const [state] = result.current;
    expect(state.selectedCountry).toBe('USA');
    expect(router.back).toHaveBeenCalled();
  });

  it('should set selected state and navigate back', () => {
    const { result } = renderHook(() => useSelectWithScreenVar());
    const [, setVar] = result.current;
    act(() => {
      setVar({ selectedState: 'California' });
    });
    const [state] = result.current;
    expect(state.selectedState).toBe('California');
    expect(router.back).toHaveBeenCalled();
  });
});
