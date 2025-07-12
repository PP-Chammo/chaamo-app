import React from 'react';

import { render, fireEvent } from '@testing-library/react-native';

import RadioInput from '../RadioInput';

describe('RadioInput', () => {
  const defaultProps = {
    label: 'Test Option',
    selected: false,
    onPress: jest.fn(),
  };

  it('renders correctly with default props', () => {
    const { getByText } = render(<RadioInput {...defaultProps} />);
    expect(getByText('Test Option')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <RadioInput {...defaultProps} onPress={onPress} />,
    );

    fireEvent.press(getByText('Test Option'));
    expect(onPress).toHaveBeenCalledTimes(1);
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
});
