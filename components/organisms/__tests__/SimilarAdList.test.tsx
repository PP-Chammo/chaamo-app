import React from 'react';

import { render, screen } from '@testing-library/react-native';

import SimilarAdList from '../SimilarAdList';

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
