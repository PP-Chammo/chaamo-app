import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react-native';

import {
  ListingType,
  useGetVwListingCardsLazyQuery,
} from '@/generated/graphql';

import RecentlyAddedList from '../RecentlyAddedList';

// Router + Link + focus effect
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

const edges: Edge[] = [1, 2, 3, 4].map((n) => ({
  node: {
    id: String(n),
    listing_type: ListingType.SELL,
    image_urls: '',
    title: `Common Item ${n}`,
    currency: 'USD',
    start_price: n * 100,
    last_sold_currency: 'USD',
    last_sold_price: n * 90,
    last_sold_is_checked: false,
    last_sold_is_correct: false,
  },
}));

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

describe('RecentlyAddedList', () => {
  it('renders correctly', () => {
    render(<RecentlyAddedList />);
    expect(screen.getByTestId('list-container')).toBeTruthy();
    expect(screen.getByText('Recently Added')).toBeTruthy();
  });

  it('renders all recently added cards', () => {
    render(<RecentlyAddedList />);
    expect(screen.getAllByTestId('listing-card')).toHaveLength(4);
  });

  it('handles right icon press on recently added card', () => {
    render(<RecentlyAddedList />);
    const firstIcon = screen.getAllByTestId('right-icon-button')[0];
    fireEvent.press(firstIcon);
    expect(firstIcon).toBeTruthy();
  });
});
