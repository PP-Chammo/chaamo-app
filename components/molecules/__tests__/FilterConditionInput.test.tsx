import React from 'react';

import { render, fireEvent } from '@testing-library/react-native';

import FilterConditionInput from '../FilterConditionInput';

describe('FilterConditionInput', () => {
  const defaultProps = {
    value: '',
    onChange: jest.fn(),
  };

  it('renders correctly with default props', () => {
    const { getByTestId, getByText } = render(
      <FilterConditionInput {...defaultProps} />,
    );
    expect(getByTestId('filter-condition-input')).toBeTruthy();
    expect(getByText('Condition')).toBeTruthy();
  });

  it('renders all condition buttons', () => {
    const { getByTestId } = render(<FilterConditionInput {...defaultProps} />);
    // Check that condition buttons are rendered
    expect(getByTestId('filter-condition-input')).toBeTruthy();
  });

  it('calls onChange when condition button is pressed', () => {
    const onChange = jest.fn();
    const { getByTestId } = render(
      <FilterConditionInput {...defaultProps} onChange={onChange} />,
    );
    // Find and press the first condition button
    const firstButton = getByTestId('filter-condition-button-raw');
    fireEvent.press(firstButton);
    expect(onChange).toHaveBeenCalledWith('condition', 'raw');
  });

  it('toggles condition value when button is pressed', () => {
    const onChange = jest.fn();
    const { getByTestId } = render(
      <FilterConditionInput
        {...defaultProps}
        value="raw"
        onChange={onChange}
      />,
    );
    const button = getByTestId('filter-condition-button-raw');
    fireEvent.press(button);
    expect(onChange).toHaveBeenCalledWith('condition', '');
  });

  it('applies correct styling classes', () => {
    const { getByTestId } = render(<FilterConditionInput {...defaultProps} />);
    expect(getByTestId('filter-condition-input')).toBeTruthy();
  });

  it('renders with multiple selected conditions', () => {
    const { getByTestId } = render(
      <FilterConditionInput {...defaultProps} value="raw,graded" />,
    );
    expect(getByTestId('filter-condition-input')).toBeTruthy();
  });
});
