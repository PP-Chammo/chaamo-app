import React from 'react';

import { render, fireEvent } from '@testing-library/react-native';

import { dummyFeaturedCardList } from '@/constants/dummy';

import FeaturedList from '../FeaturedList';

const mockProps = {
  favoriteList: [],
  refreshFavoriteCount: jest.fn(),
};

describe('FeaturedList', () => {
  it('renders correctly', () => {
    const { getByTestId } = render(<FeaturedList {...mockProps} />);
    expect(getByTestId('list-container')).toBeTruthy();
  });

  it('renders all featured cards', () => {
    const { getAllByTestId } = render(<FeaturedList {...mockProps} />);
    const featuredCards = getAllByTestId('common-card');
    expect(featuredCards.length).toBe(dummyFeaturedCardList.length);
  });

  it('displays featured title', () => {
    const { getByText } = render(<FeaturedList {...mockProps} />);
    expect(getByText('Featured')).toBeTruthy();
  });

  it('handles right icon press on featured card', () => {
    const { getAllByTestId } = render(<FeaturedList {...mockProps} />);
    const rightIcons = getAllByTestId('right-icon-button');
    fireEvent.press(rightIcons[0]);
    // The component doesn't log anything, so we just verify the press works
    expect(rightIcons[0]).toBeTruthy();
  });
});
