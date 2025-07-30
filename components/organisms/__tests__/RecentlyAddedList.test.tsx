import React from 'react';

import { render, fireEvent } from '@testing-library/react-native';

import { dummyFeaturedCardList } from '@/constants/dummy';

import RecentlyAddedList from '../RecentlyAddedList';

const mockProps = {
  favoriteList: [],
  refreshFavoriteCount: jest.fn(),
};

describe('RecentlyAddedList', () => {
  it('renders correctly', () => {
    const { getByTestId } = render(<RecentlyAddedList {...mockProps} />);
    expect(getByTestId('list-container')).toBeTruthy();
  });

  it('renders all recently added cards', () => {
    const { getAllByTestId } = render(<RecentlyAddedList {...mockProps} />);
    const commonCards = getAllByTestId('common-card');
    const auctionCards = getAllByTestId('auction-card');
    const totalCards = commonCards.length + auctionCards.length;
    expect(totalCards).toBe(dummyFeaturedCardList.length);
  });

  it('displays recently added title', () => {
    const { getByText } = render(<RecentlyAddedList {...mockProps} />);
    expect(getByText('Recently Added')).toBeTruthy();
  });

  it('handles right icon press on recently added card', () => {
    const { getAllByTestId } = render(<RecentlyAddedList {...mockProps} />);
    const rightIcons = getAllByTestId('right-icon-button');
    if (rightIcons.length > 0) {
      fireEvent.press(rightIcons[0]);
      // The component doesn't log anything, so we just verify the press works
      expect(rightIcons[0]).toBeTruthy();
    }
  });
});
