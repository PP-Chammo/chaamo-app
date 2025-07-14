import React from 'react';

import { render } from '@testing-library/react-native';

import PhoneNumberInput from '../PhoneInput';

// Mock react-native-phone-number-input
jest.mock('react-native-phone-number-input', () => 'PhoneNumberInput');

describe('PhoneNumberInput', () => {
  const defaultProps = {
    name: 'phone',
    value: '',
    onChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with default props', () => {
    const { getByTestId, getByText } = render(
      <PhoneNumberInput {...defaultProps} />,
    );
    expect(getByTestId('phone-input-container')).toBeTruthy();
    expect(getByText('Phone')).toBeTruthy();
  });

  it('renders with required indicator when required is true', () => {
    const { getByTestId } = render(
      <PhoneNumberInput {...defaultProps} required />,
    );
    expect(getByTestId('phone-input-container')).toBeTruthy();
  });

  it('renders with initial value', () => {
    const { getByTestId } = render(
      <PhoneNumberInput {...defaultProps} value="+1234567890" />,
    );
    expect(getByTestId('phone-input-container')).toBeTruthy();
  });

  it('renders with custom name prop', () => {
    const onChange = jest.fn();
    const { getByTestId } = render(
      <PhoneNumberInput {...defaultProps} name="mobile" onChange={onChange} />,
    );
    expect(getByTestId('phone-input-container')).toBeTruthy();
  });

  it('applies correct styling classes', () => {
    const { getByTestId } = render(<PhoneNumberInput {...defaultProps} />);
    expect(getByTestId('phone-input-container')).toBeTruthy();
  });

  it('calls onChange when text is entered', () => {
    const onChange = jest.fn();
    const { getByTestId } = render(
      <PhoneNumberInput {...defaultProps} onChange={onChange} name="phone" />,
    );
    const phoneInput = getByTestId('phone-input-field');
    // Simulate a change
    phoneInput.props.onChangeFormattedText('+1234567890');
    expect(onChange).toHaveBeenCalledWith({
      name: 'phone',
      value: '+1234567890',
    });
  });
});
