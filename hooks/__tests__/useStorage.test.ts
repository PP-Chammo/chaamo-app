import { renderHook } from '@testing-library/react-native';

import { useStorage } from '../useStorage';

describe('useStorage', () => {
  it('should initialize with default state', () => {
    const { result } = renderHook(() => useStorage());
    expect(result.current).toBeDefined();
  });
});
