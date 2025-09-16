import React from 'react';

import { render, screen } from '@testing-library/react-native';

import StatsProfile from '../StatsProfile';

// Mock router params to ensure no userId (so total earnings shows)
jest.mock('expo-router', () => ({
  useLocalSearchParams: () => ({}),
}));

// Mock user var with created_at and currency
jest.mock('@/hooks/useUserVar', () => ({
  useUserVar: () => [
    {
      id: 'user-1',
      created_at: '2025-07-24T00:00:00Z',
      profile: { currency: 'USD' },
    },
  ],
}));

// Mock currency display helpers
jest.mock('@/hooks/useCurrencyDisplay', () => ({
  useCurrencyDisplay: () => ({
    formatPrice: (_currency: string, amount: number) => String(amount),
    convertSymbolToCurrency: (_symbol: string) => 'USD',
    convertCurrencyToSymbol: (_currency: string) => '$',
  }),
}));

// Mock GraphQL queries
jest.mock('@/generated/graphql', () => ({
  ListingStatus: { SOLD: 'SOLD' },
  ListingType: { PORTFOLIO: 'PORTFOLIO', AUCTION: 'AUCTION', SELL: 'SELL' },
  useGetProfilesQuery: jest.fn().mockReturnValue({ data: undefined }),
  useGetUserAddressesQuery: jest.fn().mockReturnValue({
    data: {
      user_addressesCollection: {
        edges: [
          {
            node: {
              city: 'London',
              country: 'UK',
            },
          },
        ],
      },
    },
  }),
  useGetVwListingCardsQuery: jest.fn().mockReturnValue({
    data: {
      vw_listing_cardsCollection: {
        edges: [
          // Portfolio (1)
          {
            node: {
              listing_type: 'PORTFOLIO',
              status: 'ACTIVE',
              start_price: 0,
            },
          },
          // Sold (1) with start_price 300 for total earnings
          { node: { listing_type: 'SELL', status: 'SOLD', start_price: 300 } },
          // Auction (1)
          {
            node: {
              listing_type: 'AUCTION',
              status: 'ACTIVE',
              start_price: 100,
            },
          },
          // Buy Now (2)
          {
            node: { listing_type: 'SELL', status: 'ACTIVE', start_price: 200 },
          },
        ],
      },
    },
  }),
}));

describe('StatsProfile', () => {
  it('renders correctly and shows stat labels', () => {
    render(<StatsProfile />);
    expect(screen.getByTestId('stats-profile')).toBeTruthy();
    expect(screen.getByText('Portfolio Listings')).toBeTruthy();
    expect(screen.getByText('Sold Items')).toBeTruthy();
    expect(screen.getByText('Auction Items')).toBeTruthy();
    expect(screen.getByText('Buy Now Items')).toBeTruthy();
    expect(screen.getByText('Total Earnings')).toBeTruthy();
  });

  it('displays correct stats values', () => {
    render(<StatsProfile />);
    expect(
      screen.getByTestId('portfolio').props.children[0][0].props.children,
    ).toBe('1');
    expect(screen.getByTestId('sold').props.children[0][0].props.children).toBe(
      '1',
    );
    expect(
      screen.getByTestId('auction').props.children[0][0].props.children,
    ).toBe('1');
    expect(
      screen.getByTestId('buy-now').props.children[0][0].props.children,
    ).toBe('2');
    expect(
      screen.getByTestId('total-earnings').props.children[0][0].props.children,
    ).toBe('$300');
  });

  it('displays location information and member since', () => {
    render(<StatsProfile />);
    expect(screen.getByText('Location')).toBeTruthy();
    expect(screen.getByText('London, UK')).toBeTruthy();
    expect(screen.getByText('member since: Jul 24, 2025')).toBeTruthy();
    expect(screen.getByTestId('location-icon')).toBeTruthy();
  });
});
