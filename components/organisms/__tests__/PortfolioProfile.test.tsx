import React from 'react';

import { render, fireEvent } from '@testing-library/react-native';

import { dummyFeaturedCardList } from '@/constants/dummy';

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
    const { getAllByTestId } = render(<PortfolioProfile />);
    const cards = getAllByTestId('common-card');
    expect(cards.length).toBe(dummyFeaturedCardList.length);
  });

  it('handles right icon press on portfolio card', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    const { getAllByTestId } = render(<PortfolioProfile />);
    const rightIcons = getAllByTestId('right-icon-button');
    fireEvent.press(rightIcons[0]);
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringMatching(/Favorite pressed for card/),
    );
    consoleSpy.mockRestore();
  });
});
