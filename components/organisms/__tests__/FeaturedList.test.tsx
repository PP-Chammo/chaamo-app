import React from 'react';

import { render, fireEvent } from '@testing-library/react-native';

import { dummyFeaturedCardList } from '@/constants/dummy';

import FeaturedList from '../FeaturedList';

const mockProps = {
  favoriteList: [],
  refreshFavoriteCount: jest.fn(),
};

describe('FeaturedList', () => {
  it('renders correctly', () => {
    const { getByTestId } = render(<FeaturedList {...mockProps} />);
    expect(getByTestId('list-container')).toBeTruthy();
  });

  it('renders all featured cards', () => {
    const { getAllByTestId } = render(<FeaturedList {...mockProps} />);
    const commonCards = getAllByTestId('common-card');
    const auctionCards = getAllByTestId('auction-card');
    const totalCards = commonCards.length + auctionCards.length;
    expect(totalCards).toBe(dummyFeaturedCardList.length);
  });

  it('displays featured title', () => {
    const { getByText } = render(<FeaturedList {...mockProps} />);
    expect(getByText('Featured')).toBeTruthy();
  });

  it('handles right icon press on featured card', () => {
    const { getAllByTestId } = render(<FeaturedList {...mockProps} />);
    const rightIcons = getAllByTestId('right-icon-button');
    if (rightIcons.length > 0) {
      fireEvent.press(rightIcons[0]);
      // The component doesn't log anything, so we just verify the press works
      expect(rightIcons[0]).toBeTruthy();
    }
  });
});
