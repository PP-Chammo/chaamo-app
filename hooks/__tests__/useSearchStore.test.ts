import { renderHook, act } from '@testing-library/react-native';

import { useSearchStore } from '../useSearchStore';

describe('useSearchStore', () => {
  it('should initialize with default state', () => {
    const { result } = renderHook(() => useSearchStore());
    expect(result.current.query).toBe('');
    expect(result.current.location).toBe('');
    expect(result.current.priceRange).toBe('');
    expect(result.current.condition).toBe('');
    expect(result.current.adProperties).toBe('');
  });

  it('should update state with setSearch', () => {
    const { result } = renderHook(() => useSearchStore());
    act(() => {
      result.current.setSearch('query', 'test');
      result.current.setSearch('location', 'NY');
      result.current.setSearch('priceRange', '100-200');
      result.current.setSearch('condition', 'new');
      result.current.setSearch('adProperties', 'featured');
    });
    expect(result.current.query).toBe('test');
    expect(result.current.location).toBe('NY');
    expect(result.current.priceRange).toBe('100-200');
    expect(result.current.condition).toBe('new');
    expect(result.current.adProperties).toBe('featured');
  });
});
