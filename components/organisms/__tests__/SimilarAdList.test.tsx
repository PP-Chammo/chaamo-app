import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react-native';
import { router } from 'expo-router';

import {
  ListingType,
  useGetVwListingCardsLazyQuery,
} from '@/generated/graphql';

import SimilarAdList from '../SimilarAdList';

// Mock expo-router push and run useFocusEffect immediately
jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  },
  useFocusEffect: jest.fn((cb: () => void) => cb()),
}));

// Mock GraphQL lazy query hook
jest.mock('@/generated/graphql', () => {
  const actual = jest.requireActual('@/generated/graphql');
  return {
    ...actual,
    useGetVwListingCardsLazyQuery: jest.fn(),
  };
});

const defaultProps = {
  ignoreId: 'ignore-this-id',
  listingType: ListingType.SELL,
};

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

const buildEdges = (): Edge[] => [
  {
    node: {
      id: '1',
      listing_type: ListingType.AUCTION,
      image_urls: '',
      title: 'Auction Item 1',
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
      listing_type: ListingType.SELL,
      image_urls: '',
      title: 'Common Item 2',
      currency: 'USD',
      start_price: 200,
      last_sold_currency: 'USD',
      last_sold_price: 210,
      last_sold_is_checked: false,
      last_sold_is_correct: false,
    },
  },
  {
    node: {
      id: '3',
      listing_type: ListingType.SELL,
      image_urls: '',
      title: 'Common Item 3',
      currency: 'USD',
      start_price: 300,
      last_sold_currency: 'USD',
      last_sold_price: 290,
      last_sold_is_checked: false,
      last_sold_is_correct: false,
    },
  },
  {
    node: {
      id: '4',
      listing_type: ListingType.SELL,
      image_urls: '',
      title: 'Common Item 4',
      currency: 'USD',
      start_price: 400,
      last_sold_currency: 'USD',
      last_sold_price: 380,
      last_sold_is_checked: false,
      last_sold_is_correct: false,
    },
  },
];

const mockLazyQuery = (edges: Edge[], loading = false) => {
  const mockFn = jest.fn();
  (useGetVwListingCardsLazyQuery as unknown as jest.Mock).mockReturnValue([
    mockFn,
    {
      data: {
        vw_listing_cardsCollection: {
          edges,
        },
      },
      loading,
    },
  ]);
  return mockFn;
};

describe('SimilarAdList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLazyQuery(buildEdges());
  });

  it('renders the title and list container when data is available', () => {
    render(<SimilarAdList {...defaultProps} />);
    expect(screen.getByText('Similar Ads')).toBeTruthy();
    expect(screen.getByTestId('list-container')).toBeTruthy();
  });

  it('renders four product cards from edges', () => {
    render(<SimilarAdList {...defaultProps} />);
    expect(screen.getAllByTestId('listing-card')).toHaveLength(4);
  });

  it('displays some product information from edges', () => {
    render(<SimilarAdList {...defaultProps} />);
    expect(screen.getByText('Auction Item 1')).toBeTruthy();
    expect(screen.getByText('Common Item 2')).toBeTruthy();
  });

  it('navigates to detail on card press', () => {
    render(<SimilarAdList {...defaultProps} />);
    const first = screen.getAllByTestId('listing-card')[0];
    fireEvent.press(first);
    expect(router.push).toHaveBeenCalledWith({
      pathname: '/screens/listing-detail',
      params: { id: '1' },
    });
  });
});

describe('SimilarAdList edge cases', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('returns null when loading or when there are no cards', () => {
    // Loading state
    mockLazyQuery([], true);
    const { rerender, queryByTestId } = render(
      <SimilarAdList {...defaultProps} />,
    );
    expect(queryByTestId('list-container')).toBeNull();

    // Empty data
    mockLazyQuery([], false);
    rerender(<SimilarAdList {...defaultProps} />);
    expect(queryByTestId('list-container')).toBeNull();
  });
});
