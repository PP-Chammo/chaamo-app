import React from 'react';

import { fireEvent, render } from '@testing-library/react-native';

import AuctionDetailBottomBar from '../AuctionDetailBottomBar';

describe('AuctionDetailBottomBar', () => {
  const defaultProps = {
    showModal: false,
    highestBidPrice: '$400',
    endDate: new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000 + 15 * 60 * 60 * 1000,
    ).toISOString(),
    onBidNowPress: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all labels and button', () => {
    const { getByText } = render(<AuctionDetailBottomBar {...defaultProps} />);
    expect(getByText(/7d \d+h/)).toBeTruthy();
    expect(getByText('Highest Bid')).toBeTruthy();
    expect(getByText('$400')).toBeTruthy();
    expect(getByText('Bid Now')).toBeTruthy();
  });

  it('calls onBidNowPress when Bid Now is pressed', () => {
    const { getByText } = render(<AuctionDetailBottomBar {...defaultProps} />);
    fireEvent.press(getByText('Bid Now'));
    expect(defaultProps.onBidNowPress).toHaveBeenCalled();
  });
});
