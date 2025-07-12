import { selectWithScreenStore } from '../selectWithScreenStore';

describe('selectWithScreenStore', () => {
  it('should have default values', () => {
    expect(selectWithScreenStore.selectedCountry).toBe('');
    expect(selectWithScreenStore.selectedState).toBe('');
    expect(typeof selectWithScreenStore.setSelectedCountry).toBe('function');
    expect(typeof selectWithScreenStore.setSelectedState).toBe('function');
  });
});
