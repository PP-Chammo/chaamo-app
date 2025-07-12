import React from 'react';

import { render } from '@testing-library/react-native';

import ReviewsProfile from '../ReviewsProfile';

describe('ReviewsProfile', () => {
  it('renders correctly', () => {
    const { getByTestId } = render(<ReviewsProfile />);
    expect(getByTestId('reviews-profile-scroll')).toBeTruthy();
  });

  it('displays overall rating', () => {
    const { getByText } = render(<ReviewsProfile />);
    expect(getByText('4.8 (200 Reviews)')).toBeTruthy();
    expect(getByText('Outstanding: Rated 4.8 with 2 reviews')).toBeTruthy();
  });

  it('displays review header', () => {
    const { getByText } = render(<ReviewsProfile />);
    expect(getByText('3 Reviews')).toBeTruthy();
    expect(getByText('Latest')).toBeTruthy();
  });

  it('renders all review items', () => {
    const { getAllByTestId } = render(<ReviewsProfile />);
    const reviewItems = getAllByTestId('review-item');
    expect(reviewItems.length).toBe(3);
  });
});
