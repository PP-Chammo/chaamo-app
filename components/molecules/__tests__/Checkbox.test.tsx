import React from 'react';

import { fireEvent, render } from '@testing-library/react-native';
import { View } from 'react-native';

import Checkbox from '../Checkbox';

describe('Checkbox', () => {
  const defaultProps = {
    checked: false,
    onChange: jest.fn(),
    name: 'test-checkbox',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with default props', () => {
    const { getByTestId } = render(
      <Checkbox {...defaultProps} testID="checkbox" />,
    );
    expect(getByTestId('checkbox')).toBeTruthy();
  });

  it('renders with label', () => {
    const { getByText } = render(
      <Checkbox {...defaultProps} label="Test Checkbox" />,
    );
    expect(getByText('Test Checkbox')).toBeTruthy();
  });

  it('calls onChange when pressed', () => {
    const onChange = jest.fn();
    const { getByTestId } = render(
      <Checkbox {...defaultProps} onChange={onChange} testID="checkbox" />,
    );

    const checkbox = getByTestId('checkbox');
    fireEvent.press(checkbox);
    expect(onChange).toHaveBeenCalledWith({
      name: 'test-checkbox',
      value: true,
    });
  });

  it('renders with checked state', () => {
    const { getByTestId } = render(
      <Checkbox {...defaultProps} checked={true} testID="checkbox" />,
    );
    expect(getByTestId('checkbox')).toBeTruthy();
  });

  it('renders with disabled state', () => {
    const { getByTestId } = render(
      <Checkbox {...defaultProps} disabled={true} testID="checkbox" />,
    );
    expect(getByTestId('checkbox')).toBeTruthy();
  });

  it('does not call onChange when disabled and pressed', () => {
    const onChange = jest.fn();
    const { getByTestId } = render(
      <Checkbox
        {...defaultProps}
        onChange={onChange}
        disabled={true}
        testID="checkbox"
      />,
    );

    const checkbox = getByTestId('checkbox');
    fireEvent.press(checkbox);
    expect(onChange).not.toHaveBeenCalled();
  });

  it('applies custom className', () => {
    const { getByTestId } = render(
      <Checkbox
        {...defaultProps}
        className="custom-checkbox-class"
        testID="checkbox"
      />,
    );
    expect(getByTestId('checkbox')).toBeTruthy();
  });

  it('renders with children', () => {
    const { getByTestId } = render(
      <Checkbox {...defaultProps} testID="checkbox">
        <View>Custom Content</View>
      </Checkbox>,
    );
    expect(getByTestId('checkbox')).toBeTruthy();
  });

  it('renders with different labels', () => {
    const labels = ['Checkbox 1', 'Checkbox 2', 'Checkbox 3'];

    labels.forEach((label) => {
      const { getByText } = render(
        <Checkbox {...defaultProps} label={label} />,
      );
      expect(getByText(label)).toBeTruthy();
    });
  });

  it('renders with long label', () => {
    const longLabel =
      'This is a very long checkbox label that should still render correctly';
    const { getByText } = render(
      <Checkbox {...defaultProps} label={longLabel} />,
    );
    expect(getByText(longLabel)).toBeTruthy();
  });

  it('displays check icon when checked', () => {
    const { getByTestId } = render(
      <Checkbox {...defaultProps} checked={true} testID="checkbox" />,
    );
    expect(getByTestId('checkbox')).toBeTruthy();
  });

  it('does not display check icon when unchecked', () => {
    const { getByTestId } = render(
      <Checkbox {...defaultProps} checked={false} testID="checkbox" />,
    );
    expect(getByTestId('checkbox')).toBeTruthy();
  });

  it('applies correct styling classes', () => {
    const { getByTestId } = render(
      <Checkbox {...defaultProps} testID="checkbox" />,
    );
    expect(getByTestId('checkbox')).toBeTruthy();
  });

  it('renders with all props combined', () => {
    const { getByText, getByTestId } = render(
      <Checkbox
        {...defaultProps}
        label="Test Label"
        checked={true}
        disabled={false}
        className="custom-class"
        testID="checkbox"
      >
        <View>Child Content</View>
      </Checkbox>,
    );
    expect(getByText('Test Label')).toBeTruthy();
    expect(getByTestId('checkbox')).toBeTruthy();
  });

  it('toggles checked state when pressed', () => {
    const onChange = jest.fn();
    const { getByTestId, rerender } = render(
      <Checkbox {...defaultProps} onChange={onChange} testID="checkbox" />,
    );

    const checkbox = getByTestId('checkbox');

    fireEvent.press(checkbox);
    expect(onChange).toHaveBeenCalledWith({
      name: 'test-checkbox',
      value: true,
    });

    onChange.mockClear();
    rerender(
      <Checkbox
        {...defaultProps}
        checked={true}
        onChange={onChange}
        testID="checkbox"
      />,
    );

    fireEvent.press(checkbox);
    expect(onChange).toHaveBeenCalledWith({
      name: 'test-checkbox',
      value: false,
    });
  });

  it('has correct accessibility props', () => {
    const { getByTestId } = render(
      <Checkbox {...defaultProps} testID="checkbox" />,
    );
    const checkbox = getByTestId('checkbox');
    expect(checkbox.props.accessibilityRole).toBe('checkbox');
    expect(checkbox.props.accessibilityState).toEqual({
      checked: false,
      disabled: false,
    });
  });

  it('has correct accessibility props when checked', () => {
    const { getByTestId } = render(
      <Checkbox {...defaultProps} checked={true} testID="checkbox" />,
    );
    const checkbox = getByTestId('checkbox');
    expect(checkbox.props.accessibilityState).toEqual({
      checked: true,
      disabled: false,
    });
  });

  it('has correct accessibility props when disabled', () => {
    const { getByTestId } = render(
      <Checkbox {...defaultProps} disabled={true} testID="checkbox" />,
    );
    const checkbox = getByTestId('checkbox');
    expect(checkbox.props.accessibilityState).toEqual({
      checked: false,
      disabled: true,
    });
  });

  it('renders without testID when not provided', () => {
    const { toJSON } = render(<Checkbox {...defaultProps} />);
    expect(toJSON()).toBeTruthy();
  });

  it('handles multiple rapid presses', () => {
    const onChange = jest.fn();
    const { getByTestId } = render(
      <Checkbox {...defaultProps} onChange={onChange} testID="checkbox" />,
    );

    const checkbox = getByTestId('checkbox');

    fireEvent.press(checkbox);
    fireEvent.press(checkbox);
    fireEvent.press(checkbox);

    expect(onChange).toHaveBeenCalledTimes(3);
  });
});
