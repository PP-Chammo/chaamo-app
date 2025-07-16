import React from 'react';

import { render } from '@testing-library/react-native';

import { dummyFeaturedCardList } from '@/constants/dummy';

import SoldItemsProfile from '../SoldItemsProfile';

jest.mock('nativewind', () => ({
  remapProps: (Component: unknown) => Component,
  cssInterop: (Component: unknown) => Component,
}));

describe('SoldItemsProfile', () => {
  it('renders correctly', () => {
    const { getByTestId } = render(<SoldItemsProfile />);
    expect(getByTestId('sold-items-profile-list')).toBeTruthy();
  });

  it('renders all sold item cards', () => {
    const { getAllByTestId } = render(<SoldItemsProfile />);
    const cards = getAllByTestId('common-card');
    expect(cards.length).toBe(dummyFeaturedCardList.length);
  });

  it('renders Boost component for boosted items', () => {
    const { getAllByTestId } = render(<SoldItemsProfile />);
    const boosts = getAllByTestId('boost');
    expect(boosts.length).toBe(dummyFeaturedCardList.length);
  });
});
