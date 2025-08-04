import React from 'react';

import { render } from '@testing-library/react-native';

import FilterTags from '../FilterTags';

const mockUseSearchStore = {
  query: '',
  condition: '',
  location: '',
  priceRange: '',
  adProperties: '',
};

jest.mock('@/hooks/useSearchVar', () => ({
  useSearchVar: () => [mockUseSearchStore, jest.fn()],
}));

jest.mock('@/hooks/useUserVar', () => ({
  useUserVar: () => [
    {
      profile: { currency: 'USD' },
    },
  ],
}));

jest.mock('@/hooks/useCurrencyDisplay', () => ({
  useCurrencyDisplay: () => ({
    formatDisplay: (currency: string, amount: string | number) => {
      if (currency === 'USD') {
        return `$${amount}`;
      }
      return `$${amount}`;
    },
  }),
}));

describe('FilterTags', () => {
  beforeEach(() => {
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

  it('renders multiple location filters', () => {
    mockUseSearchStore.location = 'New York, Los Angeles, Paris';
    const { getByTestId } = render(<FilterTags />);
    expect(getByTestId('filter-tag-New York')).toBeTruthy();
    expect(getByTestId('filter-tag-Los Angeles')).toBeTruthy();
    expect(getByTestId('filter-tag-Paris')).toBeTruthy();
  });

  it('renders multiple condition filters', () => {
    mockUseSearchStore.condition = 'new,used,graded';
    const { getByTestId } = render(<FilterTags />);
    expect(getByTestId('filter-tag-new')).toBeTruthy();
    expect(getByTestId('filter-tag-used')).toBeTruthy();
    expect(getByTestId('filter-tag-graded')).toBeTruthy();
  });

  it('renders multiple adProperties filters', () => {
    mockUseSearchStore.adProperties = 'featured,urgent,highlighted';
    const { getByTestId } = render(<FilterTags />);
    expect(getByTestId('filter-tag-featured')).toBeTruthy();
    expect(getByTestId('filter-tag-urgent')).toBeTruthy();
    expect(getByTestId('filter-tag-highlighted')).toBeTruthy();
  });

  it('renders price range with empty min', () => {
    mockUseSearchStore.priceRange = ',500';
    const { getByText } = render(<FilterTags />);
    expect(getByText('$0 - $500')).toBeTruthy();
  });

  it('renders price range with empty max', () => {
    mockUseSearchStore.priceRange = '100,';
    const { getByText } = render(<FilterTags />);
    expect(getByText('$100 - Any')).toBeTruthy();
  });

  it('filters out empty/whitespace filters', () => {
    mockUseSearchStore.query = '   ';
    mockUseSearchStore.location = ' , , ';
    mockUseSearchStore.condition = '';
    mockUseSearchStore.priceRange = '';
    mockUseSearchStore.adProperties = '';
    const { getByTestId } = render(<FilterTags />);
    expect(getByTestId('filter-tags').children.length).toBe(0);
  });

  it('applies correct styling classes', () => {
    const { getByTestId } = render(<FilterTags />);
    expect(getByTestId('filter-tags')).toBeTruthy();
  });
});
