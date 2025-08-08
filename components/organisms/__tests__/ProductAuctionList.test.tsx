import React from 'react';

import { fireEvent, render } from '@testing-library/react-native';
import { router } from 'expo-router';

import { dummyFeaturedCardList } from '@/constants/dummy';
import { ListingType } from '@/generated/graphql';

import ProductAuctionList from '../ProductAuctionList';

jest.mock('expo-router', () => ({
  router: { push: jest.fn() },
}));

// Mock the currency hook
jest.mock('@/hooks/useCurrencyDisplay', () => ({
  useCurrencyDisplay: () => ({
    formatDisplay: (currency: string, amount: string | number) => `$${amount}`,
  }),
}));

describe('ProductAuctionList', () => {
  const mockCards = dummyFeaturedCardList.map((card, index) => ({
    node: {
      id: `card-${index}`,
      listing_type: ListingType.AUCTION,
      image_url: card.imageUrl,
      name: card.title,
      seller_username: card.title,
      currency: 'USD',
      price: card.price,
      start_price: card.price,
      created_at: new Date().toISOString(),
      is_favorite: false,
    },
  }));

  const mockOnFavoritePress = jest.fn();

  it('renders correctly', () => {
    const { getByTestId } = render(
      <ProductAuctionList
        loading={false}
        cards={mockCards}
        onFavoritePress={mockOnFavoritePress}
      />,
    );
    expect(getByTestId('product-auction-list')).toBeTruthy();
  });

  it('renders all auction items', () => {
    const { getAllByTestId } = render(
      <ProductAuctionList
        loading={false}
        cards={mockCards}
        onFavoritePress={mockOnFavoritePress}
      />,
    );
    const auctionItems = getAllByTestId('card-item');
    expect(auctionItems.length).toBe(dummyFeaturedCardList.length);
  });

  it('handles auction item press', () => {
    const { getAllByTestId } = render(
      <ProductAuctionList
        loading={false}
        cards={mockCards}
        onFavoritePress={mockOnFavoritePress}
      />,
    );
    const auctionItems = getAllByTestId('card-item');
    fireEvent.press(auctionItems[0]);
    expect(router.push).toHaveBeenCalledWith({
      pathname: '/screens/auction-detail',
      params: { id: 'card-0' },
    });
  });

  it('handles right icon press on auction item', () => {
    const { getAllByTestId } = render(
      <ProductAuctionList
        loading={false}
        cards={mockCards}
        onFavoritePress={mockOnFavoritePress}
      />,
    );
    const rightIcons = getAllByTestId('right-icon-button');
    fireEvent.press(rightIcons[0]);
    expect(mockOnFavoritePress).toHaveBeenCalledWith('card-0', false);
  });
});
