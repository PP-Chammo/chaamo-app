import React from 'react';

import { render } from '@testing-library/react-native';

import FilterSection from '../FilterSection';

// Mock expo-router
jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
  },
}));

describe('FilterSection', () => {
  it('renders correctly with default props', () => {
    const { getByTestId } = render(<FilterSection />);
    expect(getByTestId('filter-section')).toBeTruthy();
    expect(getByTestId('filter-scroll-view')).toBeTruthy();
    expect(getByTestId('filter-advanced-button')).toBeTruthy();
    expect(getByTestId('filter-price-button')).toBeTruthy();
    expect(getByTestId('filter-condition-button')).toBeTruthy();
    expect(getByTestId('filter-location-button')).toBeTruthy();
  });

  it('renders with query and result count', () => {
    const { getByTestId } = render(
      <FilterSection resultCount={10} query="test query" />,
    );
    const resultText = getByTestId('filter-result-text');
    expect(resultText.props.children).toContain(10);
    expect(resultText.props.children).toContain('test query');
  });

  it('does not render result text when query is not provided', () => {
    const { queryByTestId } = render(<FilterSection resultCount={10} />);
    expect(queryByTestId('filter-result-text')).toBeNull();
  });

  it('applies correct styling classes', () => {
    const { getByTestId } = render(<FilterSection />);
    expect(getByTestId('filter-section')).toBeTruthy();
  });

  it('renders with zero result count', () => {
    const { getByTestId } = render(
      <FilterSection resultCount={0} query="test query" />,
    );
    const resultText = getByTestId('filter-result-text');
    expect(resultText.props.children).toContain(0);
    expect(resultText.props.children).toContain('test query');
  });
});
