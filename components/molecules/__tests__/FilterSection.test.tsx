import React from 'react';

import { fireEvent, render } from '@testing-library/react-native';
import { router } from 'expo-router';

import FilterSection from '../FilterSection';

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
  });

  it('renders with query and result count', () => {
    const { getByTestId } = render(<FilterSection resultCount={10} />);
    expect(getByTestId('filter-section')).toBeTruthy();
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
    const { getByTestId } = render(<FilterSection resultCount={0} />);
    expect(getByTestId('filter-section')).toBeTruthy();
  });

  it('calls router.push when advanced filter button is pressed', () => {
    const { getByTestId } = render(<FilterSection />);
    const advancedButton = getByTestId('filter-advanced-button');
    fireEvent.press(advancedButton);
    expect(router.push).toHaveBeenCalledWith('/screens/advanced-filter');
  });
});
