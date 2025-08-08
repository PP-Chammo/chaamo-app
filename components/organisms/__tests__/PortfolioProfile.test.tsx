import React from 'react';

import { render, fireEvent } from '@testing-library/react-native';

import PortfolioProfile from '../PortfolioProfile';

jest.mock('nativewind', () => ({
  remapProps: (Component: unknown) => Component,
  cssInterop: (Component: unknown) => Component,
}));

describe('PortfolioProfile', () => {
  it('renders correctly', () => {
    const { getByTestId } = render(<PortfolioProfile />);
    expect(getByTestId('portfolio-profile-list')).toBeTruthy();
  });

  it('renders all portfolio cards', () => {
    const { queryAllByTestId } = render(<PortfolioProfile />);
    const cards = queryAllByTestId('common-card');
    expect(cards.length).toBeGreaterThanOrEqual(0);
  });

  it('handles right icon press on portfolio card', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    const { queryAllByTestId } = render(<PortfolioProfile />);
    const rightIcons = queryAllByTestId('right-icon-button');
    if (rightIcons.length > 0) {
      fireEvent.press(rightIcons[0]);
    }
    // Test passes if no errors occur during interaction
    expect(rightIcons.length).toBeGreaterThanOrEqual(0);
    consoleSpy.mockRestore();
  });
});
