import React from 'react';

import { render, fireEvent } from '@testing-library/react-native';

import { dummyFeaturedCardList } from '@/constants/dummy';

import ProductFixedList from '../ProductFixedList';

describe('ProductFixedList', () => {
  it('renders correctly', () => {
    const { getByTestId } = render(<ProductFixedList />);
    expect(getByTestId('product-fixed-list')).toBeTruthy();
  });

  it('renders all card items', () => {
    const { getAllByTestId } = render(<ProductFixedList />);
    const cardItems = getAllByTestId('card-item');
    expect(cardItems.length).toBe(dummyFeaturedCardList.length);
  });

  it('handles right icon press on card item', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    const { getAllByTestId } = render(<ProductFixedList />);
    const rightIcons = getAllByTestId('right-icon-button');
    fireEvent.press(rightIcons[0]);
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringMatching(/Favorite pressed for card/),
    );
    consoleSpy.mockRestore();
  });
});
