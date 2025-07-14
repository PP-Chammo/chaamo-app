import { renderHook, act } from '@testing-library/react-native';
import { router } from 'expo-router';

import { useSelectWithScreenStore } from '../useSelectWithScreenStore';

jest.mock('expo-router', () => ({
  router: { back: jest.fn() },
}));

describe('useSelectWithScreenStore', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useSelectWithScreenStore());
    expect(result.current.selectedCountry).toBe('');
    expect(result.current.selectedState).toBe('');
  });

  it('should set selected country and navigate back', () => {
    const { result } = renderHook(() => useSelectWithScreenStore());
    act(() => {
      result.current.setSelectedCountry('USA');
    });
    expect(result.current.selectedCountry).toBe('USA');
    expect(router.back).toHaveBeenCalled();
  });

  it('should set selected state and navigate back', () => {
    const { result } = renderHook(() => useSelectWithScreenStore());
    act(() => {
      result.current.setSelectedState('California');
    });
    expect(result.current.selectedState).toBe('California');
    expect(router.back).toHaveBeenCalled();
  });
});
