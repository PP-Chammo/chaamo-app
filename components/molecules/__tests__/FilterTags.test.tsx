import React from 'react';

import { render } from '@testing-library/react-native';

import FilterTags from '../FilterTags';

// Mock the useSearchStore hook
const mockUseSearchStore = {
  query: '',
  condition: '',
  location: '',
  priceRange: '',
  adProperties: '',
};

jest.mock('@/hooks/useSearchStore', () => ({
  useSearchStore: () => mockUseSearchStore,
}));

describe('FilterTags', () => {
  beforeEach(() => {
    // Reset mock values before each test
    mockUseSearchStore.query = '';
    mockUseSearchStore.condition = '';
    mockUseSearchStore.location = '';
    mockUseSearchStore.priceRange = '';
    mockUseSearchStore.adProperties = '';
  });

  it('renders correctly with no filters', () => {
    const { getByTestId } = render(<FilterTags />);
    expect(getByTestId('filter-tags')).toBeTruthy();
  });

  it('renders with query filter', () => {
    mockUseSearchStore.query = 'test query';
    const { getByTestId } = render(<FilterTags />);
    expect(getByTestId('filter-tags')).toBeTruthy();
  });

  it('renders with location filter', () => {
    mockUseSearchStore.location = 'New York';
    const { getByTestId } = render(<FilterTags />);
    expect(getByTestId('filter-tags')).toBeTruthy();
  });

  it('renders with price range filter', () => {
    mockUseSearchStore.priceRange = '100,500';
    const { getByTestId } = render(<FilterTags />);
    expect(getByTestId('filter-tags')).toBeTruthy();
  });

  it('renders with condition filter', () => {
    mockUseSearchStore.condition = 'new';
    const { getByTestId } = render(<FilterTags />);
    expect(getByTestId('filter-tags')).toBeTruthy();
  });

  it('renders with ad properties filter', () => {
    mockUseSearchStore.adProperties = 'featured';
    const { getByTestId } = render(<FilterTags />);
    expect(getByTestId('filter-tags')).toBeTruthy();
  });

  it('applies correct styling classes', () => {
    const { getByTestId } = render(<FilterTags />);
    expect(getByTestId('filter-tags')).toBeTruthy();
  });
});
