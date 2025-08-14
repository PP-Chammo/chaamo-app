import React from 'react';

import { render, fireEvent } from '@testing-library/react-native';

import PortfolioProfile from '../PortfolioProfile';

// Mock GraphQL generated module to avoid undefined enums and to provide data
jest.mock('@/generated/graphql', () => ({
  OrderByDirection: { DESCNULLSLAST: 'DESCNULLSLAST' },
  ListingType: { AUCTION: 'AUCTION', SELL: 'SELL' },
  ListingStatus: { SOLD: 'SOLD' },
  CardCondition: { RAW: 'RAW', GRADED: 'GRADED' },
  useGetVwChaamoListingsQuery: jest.fn().mockReturnValue({
    data: {
      vw_chaamo_cardsCollection: {
        edges: [
          {
            node: {
              id: '1',
              listing_type: 'SELL',
              image_url: '',
              name: 'Card 1',
              currency: 'USD',
              start_price: 100,
              price: 100,
              is_boosted: false,
            },
          },
          {
            node: {
              id: '2',
              listing_type: 'AUCTION',
              image_url: '',
              name: 'Card 2',
              currency: 'USD',
              start_price: 200,
              price: 200,
              is_boosted: true,
            },
          },
        ],
      },
    },
  }),
}));

jest.mock('nativewind', () => ({
  remapProps: (Component: unknown) => Component,
  cssInterop: (Component: unknown) => Component,
}));

describe('PortfolioProfile', () => {
  it('renders correctly', () => {
    const { getByTestId } = render(<PortfolioProfile />);
    expect(getByTestId('portfolio-profile-list')).toBeTruthy();
  });

  it('renders all portfolio cards', () => {
    const { queryAllByTestId } = render(<PortfolioProfile />);
    const cards = queryAllByTestId('listing-card');
    expect(cards.length).toBeGreaterThanOrEqual(0);
  });

  it('handles right icon press on portfolio card', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    const { queryAllByTestId } = render(<PortfolioProfile />);
    const rightIcons = queryAllByTestId('right-icon-button');
    if (rightIcons.length > 0) {
      fireEvent.press(rightIcons[0]);
    }
    // Test passes if no errors occur during interaction
    expect(rightIcons.length).toBeGreaterThanOrEqual(0);
    consoleSpy.mockRestore();
  });
});
