import React from 'react';

import { fireEvent, render } from '@testing-library/react-native';

import ProductDetailBottomBar from '../ProductDetailBottomBar';

describe('ProductDetailBottomBar', () => {
  const defaultProps = {
    showModal: false,
    onBuyNowPress: jest.fn(),
    onMakeAnOfferPress: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders both buttons', () => {
    const { getByText } = render(<ProductDetailBottomBar {...defaultProps} />);
    expect(getByText('Make an Offer')).toBeTruthy();
    expect(getByText('Buy Now')).toBeTruthy();
  });

  it('calls onMakeAnOfferPress when Make an Offer is pressed', () => {
    const { getByText } = render(<ProductDetailBottomBar {...defaultProps} />);
    fireEvent.press(getByText('Make an Offer'));
    expect(defaultProps.onMakeAnOfferPress).toHaveBeenCalled();
  });

  it('calls onBuyNowPress when Buy Now is pressed', () => {
    const { getByText } = render(<ProductDetailBottomBar {...defaultProps} />);
    fireEvent.press(getByText('Buy Now'));
    expect(defaultProps.onBuyNowPress).toHaveBeenCalled();
  });
});
