import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react-native';
import { router } from 'expo-router';

import {
  ListingType,
  useGetVwListingCardsLazyQuery,
} from '@/generated/graphql';

import AuctionList from '../AuctionList';

// Router + focus effect
jest.mock('expo-router', () => ({
  router: { push: jest.fn() },
  useFocusEffect: (cb: () => void) => cb(),
  Link: 'Link',
}));

// Favorites and user
jest.mock('@/hooks/useFavorites', () => ({
  useFavorites: () => ({ getIsFavorite: jest.fn(() => false) }),
}));
jest.mock('@/hooks/useUserVar', () => ({
  useUserVar: () => [{ id: 'user-1' }],
}));

// GraphQL lazy query
jest.mock('@/generated/graphql', () => {
  const actual = jest.requireActual('@/generated/graphql');
  return {
    ...actual,
    useGetVwListingCardsLazyQuery: jest.fn(),
    ListingType: { AUCTION: 'AUCTION', SELL: 'SELL' },
  };
});

type Edge = {
  node: {
    id: string;
    listing_type: ListingType;
    image_urls?: string | null;
    title?: string | null;
    currency?: string | null;
    start_price?: number | null;
    last_sold_currency?: string | null;
    last_sold_price?: number | null;
    last_sold_is_checked?: boolean | null;
    last_sold_is_correct?: boolean | null;
  };
};

const edges: Edge[] = [
  {
    node: {
      id: '1',
      listing_type: ListingType.AUCTION,
      image_urls: '',
      title: 'Auction A',
      currency: 'USD',
      start_price: 100,
      last_sold_currency: 'USD',
      last_sold_price: 90,
      last_sold_is_checked: false,
      last_sold_is_correct: false,
    },
  },
  {
    node: {
      id: '2',
      listing_type: ListingType.AUCTION,
      image_urls: '',
      title: 'Auction B',
      currency: 'USD',
      start_price: 120,
      last_sold_currency: 'USD',
      last_sold_price: 110,
      last_sold_is_checked: false,
      last_sold_is_correct: false,
    },
  },
];

beforeEach(() => {
  (useGetVwListingCardsLazyQuery as unknown as jest.Mock).mockReturnValue([
    jest.fn(),
    {
      data: {
        vw_listing_cardsCollection: {
          edges,
        },
      },
      loading: false,
    },
  ]);
});

describe('AuctionList', () => {
  it('renders correctly', () => {
    render(<AuctionList />);
    expect(screen.getByTestId('list-container')).toBeTruthy();
    expect(screen.getByText('Auction')).toBeTruthy();
  });

  it('renders auction cards', () => {
    render(<AuctionList />);
    expect(screen.getAllByTestId('listing-card').length).toBeGreaterThan(0);
  });

  it('handles auction card press', () => {
    render(<AuctionList />);
    const firstCard = screen.getAllByTestId('listing-card')[0];
    fireEvent.press(firstCard);
    expect(router.push).toHaveBeenCalledWith({
      pathname: '/screens/listing-detail',
      params: { id: '1' },
    });
  });

  it('handles right icon press on auction card', () => {
    render(<AuctionList />);
    const firstIcon = screen.getAllByTestId('right-icon-button')[0];
    fireEvent.press(firstIcon);
    expect(firstIcon).toBeTruthy();
  });
});
