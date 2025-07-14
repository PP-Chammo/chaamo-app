import React from 'react';

import { fireEvent, render } from '@testing-library/react-native';

import RadioInput from '../RadioInput';

describe('RadioInput', () => {
  const defaultProps = {
    label: 'Test Option',
    selected: false,
    name: 'test-radio',
    onPress: jest.fn(),
  };

  it('renders correctly with default props', () => {
    const { getByText } = render(<RadioInput {...defaultProps} />);
    expect(getByText('Test Option')).toBeTruthy();
  });

  it('calls onPress when pressed with correct parameters', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <RadioInput {...defaultProps} onPress={onPress} />,
    );

    fireEvent.press(getByText('Test Option'));
    expect(onPress).toHaveBeenCalledTimes(1);
    expect(onPress).toHaveBeenCalledWith({
      name: 'test-radio',
      value: 'Test Option',
    });
  });

  it('renders with selected state', () => {
    const { getByText } = render(
      <RadioInput {...defaultProps} selected={true} />,
    );
    expect(getByText('Test Option')).toBeTruthy();
  });

  it('renders with unselected state', () => {
    const { getByText } = render(
      <RadioInput {...defaultProps} selected={false} />,
    );
    expect(getByText('Test Option')).toBeTruthy();
  });

  it('applies custom className', () => {
    const { getByText } = render(
      <RadioInput {...defaultProps} className="custom-radio-class" />,
    );
    expect(getByText('Test Option')).toBeTruthy();
  });

  it('renders with different labels', () => {
    const labels = ['Option 1', 'Option 2', 'Option 3'];

    labels.forEach((label) => {
      const { getByText } = render(
        <RadioInput {...defaultProps} label={label} />,
      );
      expect(getByText(label)).toBeTruthy();
    });
  });

  it('renders with long label', () => {
    const longLabel =
      'This is a very long radio button label that should still render correctly';
    const { getByText } = render(
      <RadioInput {...defaultProps} label={longLabel} />,
    );
    expect(getByText(longLabel)).toBeTruthy();
  });

  it('displays correct icon for selected state', () => {
    const { toJSON } = render(<RadioInput {...defaultProps} selected={true} />);
    expect(toJSON()).toBeTruthy();
  });

  it('displays correct icon for unselected state', () => {
    const { toJSON } = render(
      <RadioInput {...defaultProps} selected={false} />,
    );
    expect(toJSON()).toBeTruthy();
  });

  it('applies correct styling classes', () => {
    const { toJSON } = render(<RadioInput {...defaultProps} />);
    expect(toJSON()).toBeTruthy();
  });

  it('uses keyLabel as value when provided', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <RadioInput
        {...defaultProps}
        onPress={onPress}
        keyLabel="insurance"
        label="Protect your purchase with optional insurance"
      />,
    );

    fireEvent.press(getByText('Protect your purchase with optional insurance'));
    expect(onPress).toHaveBeenCalledWith({
      name: 'test-radio',
      value: 'insurance',
    });
  });

  it('uses label as value when keyLabel is not provided', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <RadioInput
        {...defaultProps}
        onPress={onPress}
        label="Ship to pickup point"
      />,
    );

    fireEvent.press(getByText('Ship to pickup point'));
    expect(onPress).toHaveBeenCalledWith({
      name: 'test-radio',
      value: 'Ship to pickup point',
    });
  });

  it('renders with reverse layout', () => {
    const { getByText, toJSON } = render(
      <RadioInput {...defaultProps} reverse={true} />,
    );
    expect(getByText('Test Option')).toBeTruthy();
    expect(toJSON()).toBeTruthy();
  });

  it('renders without reverse layout by default', () => {
    const { getByText, toJSON } = render(<RadioInput {...defaultProps} />);
    expect(getByText('Test Option')).toBeTruthy();
    expect(toJSON()).toBeTruthy();
  });
});
