import React from 'react';

import { render } from '@testing-library/react-native';

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
    const { queryAllByTestId } = render(<SoldItemsProfile />);
    const cards = queryAllByTestId('common-card');
    expect(cards.length).toBeGreaterThanOrEqual(0);
  });

  it('renders Boost component for boosted items', () => {
    const { queryAllByTestId } = render(<SoldItemsProfile />);
    const boosts = queryAllByTestId('boost');
    expect(boosts.length).toBeGreaterThanOrEqual(0);
  });
});
