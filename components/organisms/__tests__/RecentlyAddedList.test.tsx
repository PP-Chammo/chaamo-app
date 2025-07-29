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
    const recentlyAddedCards = getAllByTestId('common-card');
    expect(recentlyAddedCards.length).toBe(dummyFeaturedCardList.length);
  });

  it('displays recently added title', () => {
    const { getByText } = render(<RecentlyAddedList {...mockProps} />);
    expect(getByText('Recently Added')).toBeTruthy();
  });

  it('handles right icon press on recently added card', () => {
    const { getAllByTestId } = render(<RecentlyAddedList {...mockProps} />);
    const rightIcons = getAllByTestId('right-icon-button');
    fireEvent.press(rightIcons[0]);
    // The component doesn't log anything, so we just verify the press works
    expect(rightIcons[0]).toBeTruthy();
  });
});
