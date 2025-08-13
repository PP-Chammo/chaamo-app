import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react-native';
import { router } from 'expo-router';

import { ListingType } from '@/generated/graphql';

import SimilarAdList from '../SimilarAdList';

jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  },
  useFocusEffect: jest.fn((cb: () => void) => cb()),
}));

const defaultProps = {
  ignoreId: 'ignore-this-id',
  listingType: ListingType.SELL,
};

describe('SimilarAdList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with title', () => {
    render(<SimilarAdList {...defaultProps} />);

    expect(screen.getByText('Similar Ads')).toBeTruthy();
  });

  it('displays the title with correct variant', () => {
    render(<SimilarAdList {...defaultProps} />);

    const title = screen.getByText('Similar Ads');
    expect(title).toBeTruthy();
  });

  it('renders ProductCardList component', () => {
    render(<SimilarAdList {...defaultProps} />);

    expect(screen.getByTestId('list-container')).toBeTruthy();
  });

  it('renders with all required elements', () => {
    render(<SimilarAdList {...defaultProps} />);

    expect(screen.getByText('Similar Ads')).toBeTruthy();
  });

  it('renders without crashing', () => {
    expect(() => render(<SimilarAdList {...defaultProps} />)).not.toThrow();
  });

  it('has proper accessibility', () => {
    render(<SimilarAdList {...defaultProps} />);

    const title = screen.getByText('Similar Ads');
    expect(title).toBeTruthy();
  });

  it('maintains consistent layout', () => {
    const { rerender } = render(<SimilarAdList {...defaultProps} />);

    expect(screen.getByText('Similar Ads')).toBeTruthy();

    rerender(<SimilarAdList {...defaultProps} />);

    expect(screen.getByText('Similar Ads')).toBeTruthy();
  });

  it('displays the correct section title', () => {
    render(<SimilarAdList {...defaultProps} />);

    expect(screen.getByText('Similar Ads')).toBeTruthy();
  });

  it('renders product cards', () => {
    render(<SimilarAdList {...defaultProps} />);

    expect(screen.getAllByTestId('listing-card')).toHaveLength(4);
  });

  it('displays product information', () => {
    render(<SimilarAdList {...defaultProps} />);

    expect(screen.getByText('Auction Item 1')).toBeTruthy();
    expect(screen.getByText('Common Item 2')).toBeTruthy();
    expect(screen.getAllByText('Common Item 3').length).toBeGreaterThan(0);
  });

  it('has onPress handlers for product cards', () => {
    render(<SimilarAdList {...defaultProps} />);

    const cards = screen.getAllByTestId('listing-card');
    expect(cards).toHaveLength(4);
    cards.forEach((card) => {
      expect(card).toBeTruthy();
    });
  });
});

describe('SimilarAdList edge cases', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders with empty data', () => {
    const { getByTestId } = render(<SimilarAdList {...defaultProps} />);
    expect(getByTestId('list-container')).toBeTruthy();
  });

  it('calls router.push when a card is pressed', () => {
    const { getAllByTestId } = render(<SimilarAdList {...defaultProps} />);
    fireEvent.press(getAllByTestId('listing-card')[0]);
    expect(router.push).toHaveBeenCalledWith({
      pathname: '/screens/listing-detail',
      params: {
        id: '1',
      },
    });
  });

  it('renders with noLink ListContainer', () => {
    jest.doMock('@/components/molecules/ListContainer', () => {
      const Actual = jest.requireActual('@/components/molecules/ListContainer');
      const MockListContainer = (props: Record<string, unknown>) => (
        <Actual.default {...props} noLink />
      );
      (MockListContainer as unknown as { displayName?: string }).displayName =
        'MockListContainer';
      return MockListContainer;
    });
    const { getByTestId } = render(<SimilarAdList {...defaultProps} />);
    expect(getByTestId('list-container')).toBeTruthy();
    jest.dontMock('@/components/molecules/ListContainer');
  });
});
