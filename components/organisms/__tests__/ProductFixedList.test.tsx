import React from 'react';

import { render, fireEvent } from '@testing-library/react-native';

import { dummyFeaturedCardList } from '@/constants/dummy';
import { ListingType } from '@/generated/graphql';

import ProductFixedList from '../ProductFixedList';

// Mock the currency hook
jest.mock('@/hooks/useCurrencyDisplay', () => ({
  useCurrencyDisplay: () => ({
    formatDisplay: (currency: string, amount: string | number) => `$${amount}`,
  }),
}));

describe('ProductFixedList', () => {
  const mockCards = dummyFeaturedCardList.map((card, index) => ({
    node: {
      id: `card-${index}`,
      listing_type: ListingType.SELL,
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
      <ProductFixedList
        loading={false}
        cards={mockCards}
        onFavoritePress={mockOnFavoritePress}
      />,
    );
    expect(getByTestId('product-fixed-list')).toBeTruthy();
  });

  it('renders all card items', () => {
    const { getAllByTestId } = render(
      <ProductFixedList
        loading={false}
        cards={mockCards}
        onFavoritePress={mockOnFavoritePress}
      />,
    );
    const cardItems = getAllByTestId('card-item');
    expect(cardItems.length).toBe(dummyFeaturedCardList.length);
  });

  it('handles right icon press on card item', () => {
    const { getAllByTestId } = render(
      <ProductFixedList
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
