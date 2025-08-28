import React from 'react';

import { render, fireEvent } from '@testing-library/react-native';

import { dummyFeaturedCardList } from '@/constants/dummy';
import { ListingType } from '@/generated/graphql';

import ProductCardList from '../ProductAllList';

// Mock the currency hook
jest.mock('@/hooks/useCurrencyDisplay', () => ({
  useCurrencyDisplay: () => ({
    formatDisplay: (currency: string, amount: string | number) => `$${amount}`,
  }),
}));

describe('ProductCardList', () => {
  const mockCards = dummyFeaturedCardList.map((card, index) => ({
    kind: 'chaamo' as const,
    edge: {
      node: {
        id: `card-${index}`,
        listing_type: ListingType.SELL,
        image_urls: card.imageUrl,
        name: card.title,
        seller_username: card.title,
        currency: 'USD',
        price: card.price,
        start_price: card.price,
        created_at: new Date().toISOString(),
        is_favorite: false,
        last_sold_currency: null,
        last_sold_price: null,
        last_sold_is_checked: false,
        last_sold_is_correct: false,
      },
    },
  }));

  const mockOnFavoritePress = jest.fn();
  const mockOnFetchMore = jest.fn();
  const mockOnRetry = jest.fn();

  it('renders correctly', () => {
    const { getByTestId } = render(
      <ProductCardList
        loading={false}
        loadingMore={false}
        isError={false}
        cards={mockCards}
        onFavoritePress={mockOnFavoritePress}
        onFetchMore={mockOnFetchMore}
        onRetry={mockOnRetry}
      />,
    );
    expect(getByTestId('merged-product-list')).toBeTruthy();
  });

  it('renders all card items', () => {
    const { getAllByTestId } = render(
      <ProductCardList
        loading={false}
        loadingMore={false}
        isError={false}
        cards={mockCards}
        onFavoritePress={mockOnFavoritePress}
        onFetchMore={mockOnFetchMore}
        onRetry={mockOnRetry}
      />,
    );
    const cardItems = getAllByTestId('card-item');
    expect(cardItems.length).toBe(dummyFeaturedCardList.length);
  });

  it('handles right icon press on card item', () => {
    const { getAllByTestId } = render(
      <ProductCardList
        loading={false}
        loadingMore={false}
        isError={false}
        cards={mockCards}
        onFavoritePress={mockOnFavoritePress}
        onFetchMore={mockOnFetchMore}
        onRetry={mockOnRetry}
      />,
    );
    const rightIcons = getAllByTestId('right-icon-button');
    fireEvent.press(rightIcons[0]);
    expect(mockOnFavoritePress).toHaveBeenCalledWith('card-0', false);
  });
});
