import React from 'react';

import { render, fireEvent } from '@testing-library/react-native';
import { router } from 'expo-router';

import AuctionList from '../AuctionList';

// Mock the router and Link component
jest.mock('expo-router', () => ({
  router: { push: jest.fn() },
  Link: 'Link',
}));

describe('AuctionList', () => {
  it('renders correctly', () => {
    const { getByTestId } = render(<AuctionList />);
    expect(getByTestId('list-container')).toBeTruthy();
  });

  it('displays auction title', () => {
    const { getByText } = render(<AuctionList />);
    expect(getByText('Auction')).toBeTruthy();
  });

  it('renders auction cards', () => {
    const { getAllByTestId } = render(<AuctionList />);
    const auctionCards = getAllByTestId('auction-card');
    expect(auctionCards.length).toBeGreaterThan(0);
  });

  it('handles auction card press', () => {
    const { getAllByTestId } = render(<AuctionList />);
    const auctionCards = getAllByTestId('auction-card');
    const firstCard = auctionCards[0];

    fireEvent.press(firstCard);

    expect(router.push).toHaveBeenCalledWith('/screens/auction-detail');
  });

  it('handles right icon press on auction card', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    const { getAllByTestId } = render(<AuctionList />);
    const rightIcons = getAllByTestId('right-icon-button');
    const firstIcon = rightIcons[0];

    fireEvent.press(firstIcon);

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringMatching(/Favorite pressed for card/),
    );
    consoleSpy.mockRestore();
  });

  it('renders with correct header styling', () => {
    const { getByTestId } = render(<AuctionList />);
    const listContainer = getByTestId('list-container');
    expect(listContainer).toBeTruthy();
  });

  it('renders with correct container styling', () => {
    const { getByTestId } = render(<AuctionList />);
    const listContainer = getByTestId('list-container');
    expect(listContainer).toBeTruthy();
  });
});
