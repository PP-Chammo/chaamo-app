import React from 'react';

import { fireEvent, render } from '@testing-library/react-native';

import PlaceOfferModalContent from '../PlaceOfferModalContent';

describe('PlaceOfferModalContent', () => {
  const defaultProps = {
    id: 'test-id',
    sellerId: 'seller-id',
    onDismiss: jest.fn(),
    title: 'test-title',
  };

  it('renders all labels and input', () => {
    const { getByText, getByDisplayValue } = render(
      <PlaceOfferModalContent {...defaultProps} />,
    );
    expect(getByText('Place your custom offer')).toBeTruthy();
    expect(getByText('Your Offer')).toBeTruthy();
    expect(getByDisplayValue('$ ')).toBeTruthy();
    expect(getByText('Send Offer')).toBeTruthy();
  });

  it('updates input value on change', () => {
    const { getByDisplayValue } = render(
      <PlaceOfferModalContent {...defaultProps} />,
    );
    const input = getByDisplayValue('$ ');
    fireEvent.changeText(input, '1234');
    expect(getByDisplayValue('$ 1234')).toBeTruthy();
  });
});
