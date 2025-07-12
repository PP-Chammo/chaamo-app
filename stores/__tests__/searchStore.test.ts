import { searchStore } from '../searchStore';

describe('searchStore', () => {
  it('should have default values', () => {
    expect(searchStore.query).toBe('');
    expect(searchStore.location).toBe('');
    expect(searchStore.priceRange).toBe('');
    expect(searchStore.condition).toBe('');
    expect(searchStore.adProperties).toBe('');
  });
});
