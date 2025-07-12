import React from 'react';

import { render, fireEvent } from '@testing-library/react-native';

import { dummyFeaturedCardList } from '@/constants/dummy';

import FeaturedList from '../FeaturedList';

describe('FeaturedList', () => {
  it('renders correctly', () => {
    const { getByTestId } = render(<FeaturedList />);
    expect(getByTestId('list-container')).toBeTruthy();
  });

  it('renders all featured cards', () => {
    const { getAllByTestId } = render(<FeaturedList />);
    const featuredCards = getAllByTestId('common-card');
    expect(featuredCards.length).toBe(dummyFeaturedCardList.length);
  });

  it('displays featured title', () => {
    const { getByText } = render(<FeaturedList />);
    expect(getByText('Featured')).toBeTruthy();
  });

  it('handles right icon press on featured card', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    const { getAllByTestId } = render(<FeaturedList />);
    const rightIcons = getAllByTestId('right-icon-button');
    fireEvent.press(rightIcons[0]);
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringMatching(/Favorite pressed for card/),
    );
    consoleSpy.mockRestore();
  });
});
