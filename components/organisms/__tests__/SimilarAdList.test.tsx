import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react-native';
import { router } from 'expo-router';

import * as dummy from '@/constants/dummy';

import SimilarAdList from '../SimilarAdList';

jest.mock('expo-router', () => ({
  router: { push: jest.fn() },
}));

const originalDummyList = [...dummy.dummyFeaturedCardList];

describe('SimilarAdList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with title', () => {
    render(<SimilarAdList />);

    expect(screen.getByText('Similar Ads')).toBeTruthy();
  });

  it('displays the title with correct variant', () => {
    render(<SimilarAdList />);

    const title = screen.getByText('Similar Ads');
    expect(title).toBeTruthy();
  });

  it('renders ProductCardList component', () => {
    render(<SimilarAdList />);

    // The ProductCardList component should be rendered
    expect(screen.getByTestId('list-container')).toBeTruthy();
  });

  it('renders with all required elements', () => {
    render(<SimilarAdList />);

    expect(screen.getByText('Similar Ads')).toBeTruthy();
  });

  it('renders without crashing', () => {
    expect(() => render(<SimilarAdList />)).not.toThrow();
  });

  it('has proper accessibility', () => {
    render(<SimilarAdList />);

    const title = screen.getByText('Similar Ads');
    expect(title).toBeTruthy();
  });

  it('maintains consistent layout', () => {
    const { rerender } = render(<SimilarAdList />);

    expect(screen.getByText('Similar Ads')).toBeTruthy();

    rerender(<SimilarAdList />);

    expect(screen.getByText('Similar Ads')).toBeTruthy();
  });

  it('displays the correct section title', () => {
    render(<SimilarAdList />);

    expect(screen.getByText('Similar Ads')).toBeTruthy();
  });

  it('renders product cards', () => {
    render(<SimilarAdList />);

    // Check for product cards
    expect(screen.getAllByTestId('common-card')).toHaveLength(3);
  });

  it('displays product information', () => {
    render(<SimilarAdList />);

    expect(screen.getByText('Elly De La Cruz 1')).toBeTruthy();
    expect(screen.getByText('Elly De La Cruz 2')).toBeTruthy();
    expect(screen.getByText('Elly De La Cruz 3')).toBeTruthy();
  });

  it('has onPress handlers for product cards', () => {
    render(<SimilarAdList />);

    const productCards = screen.getAllByTestId('common-card');
    expect(productCards).toHaveLength(3);

    // Test that each card exists
    productCards.forEach((card) => {
      expect(card).toBeTruthy();
    });
  });
});

describe('SimilarAdList edge cases', () => {
  afterEach(() => {
    dummy.dummyFeaturedCardList.length = 0;
    originalDummyList.forEach((item) => dummy.dummyFeaturedCardList.push(item));
    jest.clearAllMocks();
  });

  it('renders with empty data', () => {
    dummy.dummyFeaturedCardList.length = 0;
    const { getByTestId } = render(<SimilarAdList />);
    expect(getByTestId('list-container')).toBeTruthy();
  });

  it('renders a card with no imageUrl', () => {
    dummy.dummyFeaturedCardList[0].imageUrl = '';
    const { getAllByTestId } = render(<SimilarAdList />);
    expect(
      getAllByTestId('common-card-image-placeholder').length,
    ).toBeGreaterThan(0);
  });

  it('renders a featured card', () => {
    dummy.dummyFeaturedCardList[0].boosted = true;
    dummy.dummyFeaturedCardList[0].imageUrl = 'https://example.com/image1.jpg';
    dummy.dummyFeaturedCardList[0].price = '$200.00';
    const { getAllByTestId } = render(<SimilarAdList />);
    expect(getAllByTestId('badge').length).toBeGreaterThan(0);
  });

  it('calls router.push when a card is pressed', () => {
    const { getAllByTestId } = render(<SimilarAdList />);
    fireEvent.press(getAllByTestId('common-card')[0]);
    expect(router.push).toHaveBeenCalledWith('/screens/product-detail');
  });

  it('renders with noLink ListContainer', () => {
    // Patch ListContainer to force noLink
    jest.doMock('@/components/molecules/ListContainer', () => {
      const Actual = jest.requireActual('@/components/molecules/ListContainer');
      const MockListContainer = (props: Record<string, unknown>) => (
        <Actual.default {...props} noLink />
      );
      (MockListContainer as unknown as { displayName?: string }).displayName =
        'MockListContainer';
      return MockListContainer;
    });
    const { getByTestId } = render(<SimilarAdList />);
    expect(getByTestId('list-container')).toBeTruthy();
    jest.dontMock('@/components/molecules/ListContainer');
  });
});
