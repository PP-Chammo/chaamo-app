import React from 'react';

import { fireEvent, render } from '@testing-library/react-native';

import TextField from '../TextField';

describe('TextField', () => {
  const defaultProps = {
    name: 'test',
    onChange: jest.fn(),
  };

  it('renders correctly with default props', () => {
    const { getByTestId } = render(<TextField {...defaultProps} />);
    expect(getByTestId('text-input')).toBeTruthy();
  });

  it('renders with label', () => {
    const { getByText } = render(
      <TextField {...defaultProps} label="Test Label" />,
    );
    expect(getByText('Test Label')).toBeTruthy();
  });

  it('renders with required indicator', () => {
    const { getByTestId } = render(
      <TextField {...defaultProps} label="Test Label" required />,
    );
    expect(getByTestId('text-field-container')).toBeTruthy();
  });

  it('renders with placeholder', () => {
    const { getByPlaceholderText } = render(
      <TextField {...defaultProps} placeholder="Enter text" />,
    );
    expect(getByPlaceholderText('Enter text')).toBeTruthy();
  });

  it('renders with initial value', () => {
    const { getByTestId } = render(
      <TextField {...defaultProps} value="initial value" />,
    );
    expect(getByTestId('text-input')).toBeTruthy();
  });

  it('calls onChange when text is changed', () => {
    const onChange = jest.fn();
    const { getByTestId } = render(
      <TextField {...defaultProps} onChange={onChange} />,
    );

    const input = getByTestId('text-input');
    fireEvent.changeText(input, 'new value');

    expect(onChange).toHaveBeenCalledWith({ name: 'test', value: 'new value' });
  });

  it('renders as password field', () => {
    const { getByTestId } = render(
      <TextField {...defaultProps} type="password" />,
    );
    const input = getByTestId('text-input');
    expect(input.props.secureTextEntry).toBe(true);
  });

  it('toggles password visibility', () => {
    const { getByTestId } = render(
      <TextField {...defaultProps} type="password" />,
    );

    const input = getByTestId('text-input');
    const eyeIcon = getByTestId('eye-icon');

    expect(input.props.secureTextEntry).toBe(true);

    fireEvent.press(eyeIcon);
    expect(input.props.secureTextEntry).toBe(false);

    fireEvent.press(eyeIcon);
    expect(input.props.secureTextEntry).toBe(true);
  });

  it('renders with error message', () => {
    const { getByText } = render(
      <TextField {...defaultProps} error="This field is required" />,
    );
    expect(getByText('This field is required')).toBeTruthy();
  });

  it('renders with left icon', () => {
    const { getByTestId } = render(
      <TextField {...defaultProps} leftIcon="search" />,
    );
    expect(getByTestId('text-input')).toBeTruthy();
  });

  it('applies custom className', () => {
    const { getByTestId } = render(
      <TextField {...defaultProps} className="custom-class" />,
    );
    expect(getByTestId('text-field-container')).toBeTruthy();
  });

  it('applies custom inputClassName', () => {
    const { getByTestId } = render(
      <TextField {...defaultProps} inputClassName="custom-input-class" />,
    );
    expect(getByTestId('text-input')).toBeTruthy();
  });

  it('handles empty value', () => {
    const onChange = jest.fn();
    const { getByTestId } = render(
      <TextField {...defaultProps} onChange={onChange} />,
    );

    const input = getByTestId('text-input');
    fireEvent.changeText(input, '');

    expect(onChange).toHaveBeenCalledWith({ name: 'test', value: '' });
  });

  it('handles multiple text changes', () => {
    const onChange = jest.fn();
    const { getByTestId } = render(
      <TextField {...defaultProps} onChange={onChange} />,
    );

    const input = getByTestId('text-input');

    fireEvent.changeText(input, 'a');
    fireEvent.changeText(input, 'ab');
    fireEvent.changeText(input, 'abc');

    expect(onChange).toHaveBeenCalledTimes(3);
    expect(onChange).toHaveBeenLastCalledWith({ name: 'test', value: 'abc' });
  });

  it('renders with custom name prop', () => {
    const onChange = jest.fn();
    const { getByTestId } = render(
      <TextField {...defaultProps} name="customName" onChange={onChange} />,
    );

    const input = getByTestId('text-input');
    fireEvent.changeText(input, 'test value');

    expect(onChange).toHaveBeenCalledWith({
      name: 'customName',
      value: 'test value',
    });
  });
});
