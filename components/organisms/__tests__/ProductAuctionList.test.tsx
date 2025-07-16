import React from 'react';

import { fireEvent, render } from '@testing-library/react-native';
import { router } from 'expo-router';

import { dummyFeaturedCardList } from '@/constants/dummy';

import ProductAuctionList from '../ProductAuctionList';

jest.mock('expo-router', () => ({
  router: { push: jest.fn() },
}));

describe('ProductAuctionList', () => {
  it('renders correctly', () => {
    const { getByTestId } = render(<ProductAuctionList />);
    expect(getByTestId('product-auction-list')).toBeTruthy();
  });

  it('renders all auction items', () => {
    const { getAllByTestId } = render(<ProductAuctionList />);
    const auctionItems = getAllByTestId('auction-item');
    expect(auctionItems.length).toBe(dummyFeaturedCardList.length);
  });

  it('handles auction item press', () => {
    const { getAllByTestId } = render(<ProductAuctionList />);
    const auctionItems = getAllByTestId('auction-item');
    fireEvent.press(auctionItems[0]);
    expect(router.push).toHaveBeenCalledWith('/screens/auction-detail');
  });

  it('handles right icon press on auction item', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    const { getAllByTestId } = render(<ProductAuctionList />);
    const rightIcons = getAllByTestId('right-icon-button');
    fireEvent.press(rightIcons[0]);
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringMatching(/Favorite pressed for card/),
    );
    consoleSpy.mockRestore();
  });
});
