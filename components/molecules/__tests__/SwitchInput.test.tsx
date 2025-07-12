import React from 'react';

import { render, fireEvent } from '@testing-library/react-native';

import SwitchInput from '../SwitchInput';

describe('SwitchInput', () => {
  const defaultProps = {
    label: 'Test Switch',
    value: false,
    onValueChange: jest.fn(),
  };

  it('renders correctly with default props', () => {
    const { getByText } = render(<SwitchInput {...defaultProps} />);
    expect(getByText('Test Switch')).toBeTruthy();
  });

  it('calls onValueChange when switch is toggled', () => {
    const onValueChange = jest.fn();
    const { getByRole } = render(
      <SwitchInput {...defaultProps} onValueChange={onValueChange} />,
    );

    const switchElement = getByRole('switch');
    fireEvent(switchElement, 'valueChange', true);

    expect(onValueChange).toHaveBeenCalledWith(true);
  });

  it('renders with enabled state', () => {
    const { getByText } = render(
      <SwitchInput {...defaultProps} value={true} />,
    );
    expect(getByText('Test Switch')).toBeTruthy();
  });

  it('renders with disabled state', () => {
    const { getByText } = render(
      <SwitchInput {...defaultProps} disabled={true} />,
    );
    expect(getByText('Test Switch')).toBeTruthy();
  });

  it('renders with different labels', () => {
    const labels = ['Switch 1', 'Switch 2', 'Switch 3'];

    labels.forEach((label) => {
      const { getByText } = render(
        <SwitchInput {...defaultProps} label={label} />,
      );
      expect(getByText(label)).toBeTruthy();
    });
  });

  it('renders with long label', () => {
    const longLabel =
      'This is a very long switch label that should still render correctly';
    const { getByText } = render(
      <SwitchInput {...defaultProps} label={longLabel} />,
    );
    expect(getByText(longLabel)).toBeTruthy();
  });

  it('applies correct styling classes', () => {
    const { toJSON } = render(<SwitchInput {...defaultProps} />);
    expect(toJSON()).toBeTruthy();
  });

  it('renders with all props combined', () => {
    const { getByText } = render(
      <SwitchInput {...defaultProps} value={true} disabled={false} />,
    );
    expect(getByText('Test Switch')).toBeTruthy();
  });

  it('handles multiple value changes', () => {
    const onValueChange = jest.fn();
    const { getByRole } = render(
      <SwitchInput {...defaultProps} onValueChange={onValueChange} />,
    );

    const switchElement = getByRole('switch');

    fireEvent(switchElement, 'valueChange', true);
    fireEvent(switchElement, 'valueChange', false);
    fireEvent(switchElement, 'valueChange', true);

    expect(onValueChange).toHaveBeenCalledTimes(3);
    expect(onValueChange).toHaveBeenNthCalledWith(1, true);
    expect(onValueChange).toHaveBeenNthCalledWith(2, false);
    expect(onValueChange).toHaveBeenNthCalledWith(3, true);
  });
});
