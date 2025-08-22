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
    expect(getByText('5 (0 Reviews)')).toBeTruthy();
    expect(getByText('Outstanding: 0 reviews')).toBeTruthy();
  });

  it('displays review header', () => {
    const { getByText } = render(<ReviewsProfile />);
    expect(getByText('0 Reviews')).toBeTruthy();
    expect(getByText('Latest')).toBeTruthy();
  });

  it('renders all review items', () => {
    const { queryAllByTestId } = render(<ReviewsProfile />);
    const reviewItems = queryAllByTestId('review-item');
    expect(reviewItems.length).toBe(0);
  });
});
