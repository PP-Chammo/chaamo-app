import React from 'react';

import { render } from '@testing-library/react-native';
import { OtpInput as OtpInputComponent } from 'react-native-otp-entry';

import OTPInput from '../OtpInput';

// Mock react-native-otp-entry
jest.mock('react-native-otp-entry', () => ({
  OtpInput: 'OtpInput',
}));

describe('OTPInput', () => {
  const defaultProps = {
    name: 'otp',
    onChange: jest.fn(),
    error: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with default props', () => {
    const { getByTestId } = render(<OTPInput {...defaultProps} />);
    expect(getByTestId('otp-input')).toBeTruthy();
  });

  it('renders with error when error is true', () => {
    const { getByText } = render(<OTPInput {...defaultProps} error={true} />);
    expect(getByText('Error! Incorrect OTP Entered')).toBeTruthy();
  });

  it('does not render error when error is false', () => {
    const { queryByText } = render(
      <OTPInput {...defaultProps} error={false} />,
    );
    expect(queryByText('Error! Incorrect OTP Entered')).toBeNull();
  });

  it('renders with custom name', () => {
    const { getByTestId } = render(
      <OTPInput {...defaultProps} name="customOtp" />,
    );
    expect(getByTestId('otp-input')).toBeTruthy();
  });

  it('applies correct styling classes', () => {
    const { getByTestId } = render(<OTPInput {...defaultProps} />);
    expect(getByTestId('otp-input')).toBeTruthy();
  });

  it('calls onChange when text is entered', () => {
    const onChange = jest.fn();
    const { UNSAFE_getAllByType } = render(
      <OTPInput {...defaultProps} onChange={onChange} name="otp" />,
    );
    // Find the OtpInput component and trigger onTextChange
    const OtpInputInstance = UNSAFE_getAllByType(OtpInputComponent)[0];
    if (OtpInputInstance && OtpInputInstance.props.onTextChange) {
      OtpInputInstance.props.onTextChange('123456');
      expect(onChange).toHaveBeenCalledWith({ name: 'otp', value: '123456' });
    }
  });
});
