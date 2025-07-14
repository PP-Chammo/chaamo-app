import React from 'react';

import { fireEvent, render } from '@testing-library/react-native';

import CardField from '../CardField';
describe('CardField', () => {
  it('renders correctly', () => {
    const { getByText } = render(
      <CardField
        value=""
        onChange={jest.fn()}
        label="Card Number"
        name="cardNumber"
      />,
    );
    expect(getByText('Card Number')).toBeTruthy();
  });
  it('calls onChange when input changes', () => {
    const onChange = jest.fn();
    const { getByDisplayValue } = render(
      <CardField
        value=""
        onChange={onChange}
        label="Card Number"
        name="cardNumber"
      />,
    );
    const input = getByDisplayValue('');
    fireEvent.changeText(input, '1234');
    expect(onChange).toHaveBeenCalledWith({
      name: 'cardNumber',
      value: '1234',
    });
  });
  it('shows error message', () => {
    const { getByText } = render(
      <CardField
        value=""
        onChange={jest.fn()}
        label="Card Number"
        name="cardNumber"
        error="Test error"
      />,
    );
    expect(getByText('Test error')).toBeTruthy();
  });
  it('shows required asterisk', () => {
    const { getByText } = render(
      <CardField
        value=""
        onChange={jest.fn()}
        label="Card Number"
        name="cardNumber"
        required
      />,
    );
    expect(getByText('*')).toBeTruthy();
  });
  it('shows invalid card number message', () => {
    const { getByText } = render(
      <CardField
        value="1234"
        onChange={jest.fn()}
        label="Card Number"
        name="cardNumber"
      />,
    );
    expect(getByText('Invalid card number')).toBeTruthy();
  });
});
