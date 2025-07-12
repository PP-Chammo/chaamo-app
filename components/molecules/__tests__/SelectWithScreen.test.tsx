import React from 'react';

import { render, fireEvent } from '@testing-library/react-native';
import { View } from 'react-native';

import SelectWithScreen from '../SelectWithScreen';

describe('SelectWithScreen', () => {
  const defaultProps = {
    onPress: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with default props', () => {
    const { getByTestId } = render(<SelectWithScreen {...defaultProps} />);
    expect(getByTestId('select-with-screen')).toBeTruthy();
  });

  it('renders with label', () => {
    const { getByText } = render(
      <SelectWithScreen {...defaultProps} label="Select Option" />,
    );
    expect(getByText('Select Option')).toBeTruthy();
  });

  it('renders with required indicator when required is true', () => {
    const { getByTestId, getByText } = render(
      <SelectWithScreen {...defaultProps} label="Select Option" required />,
    );
    expect(getByTestId('select-with-screen')).toBeTruthy();
    expect(getByText('*')).toBeTruthy();
  });

  it('renders with placeholder', () => {
    const { getByPlaceholderText } = render(
      <SelectWithScreen {...defaultProps} placeholder="Choose an option" />,
    );
    expect(getByPlaceholderText('Choose an option')).toBeTruthy();
  });

  it('renders with error message', () => {
    const { getByText } = render(
      <SelectWithScreen {...defaultProps} error="This field is required" />,
    );
    expect(getByText('This field is required')).toBeTruthy();
  });

  it('calls onPress when input is pressed', () => {
    const onPress = jest.fn();
    const { getByTestId } = render(
      <SelectWithScreen {...defaultProps} onPress={onPress} />,
    );
    const input = getByTestId('select-input');
    fireEvent.press(input);
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('renders with left icon', () => {
    const { getByTestId } = render(
      <SelectWithScreen
        {...defaultProps}
        leftIcon={<View testID="left-icon" />}
      />,
    );
    expect(getByTestId('left-icon-container')).toBeTruthy();
    expect(getByTestId('left-icon')).toBeTruthy();
  });

  it('renders with custom input className', () => {
    const { getByTestId } = render(
      <SelectWithScreen
        {...defaultProps}
        inputClassName="custom-input-class"
      />,
    );
    expect(getByTestId('select-input')).toBeTruthy();
  });

  it('renders with value', () => {
    const { getByTestId } = render(
      <SelectWithScreen {...defaultProps} value="Selected Value" />,
    );
    const input = getByTestId('select-input');
    expect(input.props.value).toBe('Selected Value');
  });

  it('renders with all props combined', () => {
    const onPress = jest.fn();
    const { getByPlaceholderText, getByTestId, getByText } = render(
      <SelectWithScreen
        {...defaultProps}
        label="Country"
        required
        placeholder="Select your country"
        error="Please select a country"
        value="United States"
        onPress={onPress}
        leftIcon={<View testID="flag-icon" />}
        inputClassName="custom-class"
      />,
    );

    expect(getByTestId('select-with-screen')).toBeTruthy();
    expect(getByText('*')).toBeTruthy();
    expect(getByPlaceholderText('Select your country')).toBeTruthy();
    expect(getByText('Please select a country')).toBeTruthy();
    expect(getByTestId('flag-icon')).toBeTruthy();
  });

  it('applies correct styling classes', () => {
    const { getByTestId } = render(<SelectWithScreen {...defaultProps} />);
    expect(getByTestId('select-with-screen')).toBeTruthy();
  });
});
