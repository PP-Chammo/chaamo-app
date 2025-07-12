import React from 'react';

import { render, fireEvent } from '@testing-library/react-native';

import { dummyFeaturedCardList } from '@/constants/dummy';

import RecentlyAddedList from '../RecentlyAddedList';

describe('RecentlyAddedList', () => {
  it('renders correctly', () => {
    const { getByTestId } = render(<RecentlyAddedList />);
    expect(getByTestId('list-container')).toBeTruthy();
  });

  it('renders all recently added cards', () => {
    const { getAllByTestId } = render(<RecentlyAddedList />);
    const cards = getAllByTestId('common-card');
    expect(cards.length).toBe(dummyFeaturedCardList.length);
  });

  it('displays recently added title', () => {
    const { getByText } = render(<RecentlyAddedList />);
    expect(getByText('Recently Added')).toBeTruthy();
  });

  it('handles right icon press on recently added card', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    const { getAllByTestId } = render(<RecentlyAddedList />);
    const rightIcons = getAllByTestId('right-icon-button');
    fireEvent.press(rightIcons[0]);
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringMatching(/Favorite pressed for card/),
    );
    consoleSpy.mockRestore();
  });
});
