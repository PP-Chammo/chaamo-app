import { act, renderHook } from '@testing-library/react-native';

import { useSearchVar } from '../useSearchVar';

describe('useSearchVar', () => {
  it('should initialize with default state', () => {
    const { result } = renderHook(() => useSearchVar());
    const [searchVar] = result.current;
    expect(searchVar.query).toBe('');
    expect(searchVar.location).toBe('');
    expect(searchVar.priceRange).toBe('');
    expect(searchVar.condition).toBe('');
    expect(searchVar.adProperties).toBe('');
  });

  it('should update state with setSearchVar', () => {
    const { result } = renderHook(() => useSearchVar());
    act(() => {
      result.current[1]({ query: 'test' });
    });
    act(() => {
      result.current[1]({ location: 'NY' });
    });
    act(() => {
      result.current[1]({ priceRange: '100-200' });
    });
    act(() => {
      result.current[1]({ condition: 'new' });
    });
    act(() => {
      result.current[1]({ adProperties: 'featured' });
    });
    const [searchVar] = result.current;
    expect(searchVar.query).toBe('test');
    expect(searchVar.location).toBe('NY');
    expect(searchVar.priceRange).toBe('100-200');
    expect(searchVar.condition).toBe('new');
    expect(searchVar.adProperties).toBe('featured');
  });
});
