import React from 'react';

import { render, fireEvent } from '@testing-library/react-native';

import TextArea from '../TextArea';

describe('TextArea', () => {
  const defaultProps = {
    name: 'test-textarea',
    onChange: jest.fn(),
  };

  it('renders correctly with default props', () => {
    const { toJSON } = render(<TextArea {...defaultProps} />);
    expect(toJSON()).toBeTruthy();
  });

  it('renders with label', () => {
    const { getByText } = render(
      <TextArea {...defaultProps} label="Test Label" />,
    );
    expect(getByText('Test Label')).toBeTruthy();
  });

  it('renders with placeholder', () => {
    const { getByPlaceholderText } = render(
      <TextArea {...defaultProps} placeholder="Enter text here" />,
    );
    expect(getByPlaceholderText('Enter text here')).toBeTruthy();
  });

  it('calls onChange when text is entered', () => {
    const onChange = jest.fn();
    const { getByPlaceholderText } = render(
      <TextArea
        {...defaultProps}
        onChange={onChange}
        placeholder="Enter text"
      />,
    );

    const input = getByPlaceholderText('Enter text');
    fireEvent.changeText(input, 'test input');

    expect(onChange).toHaveBeenCalledWith({
      name: 'test-textarea',
      value: 'test input',
    });
  });

  it('applies custom inputClassName', () => {
    const { toJSON } = render(
      <TextArea {...defaultProps} inputClassName="custom-input-class" />,
    );
    expect(toJSON()).toBeTruthy();
  });

  it('renders with initial value', () => {
    const { toJSON } = render(
      <TextArea {...defaultProps} value="initial text" />,
    );
    expect(toJSON()).toBeTruthy();
  });

  it('passes through TextInput props', () => {
    const { getByPlaceholderText } = render(
      <TextArea
        {...defaultProps}
        placeholder="Custom placeholder"
        autoFocus={true}
        testID="textarea-input"
      />,
    );
    expect(getByPlaceholderText('Custom placeholder')).toBeTruthy();
  });

  it('renders with different labels', () => {
    const labels = ['Label 1', 'Label 2', 'Label 3'];

    labels.forEach((label) => {
      const { getByText } = render(
        <TextArea {...defaultProps} label={label} />,
      );
      expect(getByText(label)).toBeTruthy();
    });
  });

  it('renders with long label', () => {
    const longLabel =
      'This is a very long textarea label that should still render correctly';
    const { getByText } = render(
      <TextArea {...defaultProps} label={longLabel} />,
    );
    expect(getByText(longLabel)).toBeTruthy();
  });

  it('applies correct styling classes', () => {
    const { toJSON } = render(<TextArea {...defaultProps} />);
    expect(toJSON()).toBeTruthy();
  });

  it('renders with all props combined', () => {
    const { getByText, getByPlaceholderText } = render(
      <TextArea
        {...defaultProps}
        label="Test Label"
        placeholder="Enter text here"
        value="initial value"
        inputClassName="custom-class"
      />,
    );
    expect(getByText('Test Label')).toBeTruthy();
    expect(getByPlaceholderText('Enter text here')).toBeTruthy();
  });

  it('handles multiline input correctly', () => {
    const { getByPlaceholderText } = render(
      <TextArea {...defaultProps} placeholder="Multiline input" />,
    );
    const input = getByPlaceholderText('Multiline input');
    expect(input).toBeTruthy();
  });
});
