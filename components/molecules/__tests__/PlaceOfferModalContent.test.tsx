import React from 'react';

import { fireEvent, render } from '@testing-library/react-native';

import PlaceOfferModalContent from '../PlaceOfferModalContent';

describe('PlaceOfferModalContent', () => {
  it('renders all labels and input', () => {
    const { getByText, getByDisplayValue } = render(<PlaceOfferModalContent />);
    expect(getByText('Place your custom offer')).toBeTruthy();
    expect(getByText('Your Offer')).toBeTruthy();
    expect(getByDisplayValue('$5000')).toBeTruthy();
    expect(getByText('Send Offer')).toBeTruthy();
  });

  it('updates input value on change', () => {
    const { getByDisplayValue } = render(<PlaceOfferModalContent />);
    const input = getByDisplayValue('$5000');
    fireEvent.changeText(input, '1234');
    expect(getByDisplayValue('$1234')).toBeTruthy();
  });
});
