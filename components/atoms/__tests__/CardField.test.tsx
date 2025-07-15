import React from 'react';

import { fireEvent, render } from '@testing-library/react-native';

import CardField from '../CardField';

jest.mock('@/assets/svg', () => {
  const { Text } = jest.requireActual('react-native');
  return {
    VisaCard: () => <Text>VisaCard</Text>,
    MasterCard: () => <Text>MasterCard</Text>,
  };
});

jest.mock('@/utils/card', () => ({
  formatCardField: jest.fn((v) => v),
  validateCardNumber: jest.fn((v) => {
    let cardType = null;
    if (v.startsWith('4')) cardType = 'visa';
    else if (v.startsWith('5')) cardType = 'mastercard';

    return {
      isValid: v === '4111 1111 1111 1111',
      isVisa: v.startsWith('4'),
      isMasterCard: v.startsWith('5'),
      cardType,
    };
  }),
}));

describe('CardField', () => {
  const defaultProps = {
    value: '',
    onChange: jest.fn(),
    label: 'Card Number',
    name: 'cardNumber',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with label and required', () => {
    const { getByText } = render(<CardField {...defaultProps} required />);
    expect(getByText(/Card Number/)).toBeTruthy();
  });

  it('calls onChange with formatted value', () => {
    const onChange = jest.fn();
    const { getByLabelText } = render(
      <CardField {...defaultProps} onChange={onChange} value="" />,
    );
    const input = getByLabelText('Card Number');
    fireEvent.changeText(input, '4111 1111 1111 1111');
    expect(onChange).toHaveBeenCalledWith({
      name: 'cardNumber',
      value: '4111 1111 1111 1111',
    });
  });

  it('shows error message if error prop is set', () => {
    const { getByText } = render(
      <CardField {...defaultProps} error="Invalid input" />,
    );
    expect(getByText(/Invalid input/)).toBeTruthy();
  });

  it('shows invalid card number message for invalid card', () => {
    const { getByText } = render(
      <CardField {...defaultProps} value="1234 5678 9012 3456" />,
    );
    expect(getByText(/Invalid card number/)).toBeTruthy();
  });

  it('renders VisaCard icon for Visa number', () => {
    const { getByText } = render(
      <CardField {...defaultProps} value="4111 1111 1111 1111" />,
    );
    expect(getByText('VisaCard')).toBeTruthy();
  });

  it('renders MasterCard icon for MasterCard number', () => {
    const { getByText } = render(
      <CardField {...defaultProps} value="5111 1111 1111 1111" />,
    );
    expect(getByText('MasterCard')).toBeTruthy();
  });

  it('does not render card icon for unknown card', () => {
    const { queryByText } = render(
      <CardField {...defaultProps} value="6011 1111 1111 1117" />,
    );
    expect(queryByText('VisaCard')).toBeNull();
    expect(queryByText('MasterCard')).toBeNull();
  });
});
