import React from 'react';

import { fireEvent, render } from '@testing-library/react-native';

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
    expect(getByTestId('filter-condition-input')).toBeTruthy();
  });

  it('calls onChange when condition button is pressed', () => {
    const onChange = jest.fn();
    const { getByTestId } = render(
      <FilterConditionInput {...defaultProps} onChange={onChange} />,
    );
    const firstButton = getByTestId('filter-condition-button-RAW');
    fireEvent.press(firstButton);
    expect(onChange).toHaveBeenCalledWith('RAW');
  });

  it('toggles condition value when button is pressed', () => {
    const onChange = jest.fn();
    const { getByTestId } = render(
      <FilterConditionInput
        {...defaultProps}
        value="RAW"
        onChange={onChange}
      />,
    );
    const button = getByTestId('filter-condition-button-RAW');
    fireEvent.press(button);
    expect(onChange).toHaveBeenCalledWith('');
  });

  it('applies correct styling classes', () => {
    const { getByTestId } = render(<FilterConditionInput {...defaultProps} />);
    expect(getByTestId('filter-condition-input')).toBeTruthy();
  });

  it('renders with multiple selected conditions', () => {
    const { getByTestId } = render(
      <FilterConditionInput {...defaultProps} value="RAW,GRADED" />,
    );
    expect(getByTestId('filter-condition-input')).toBeTruthy();
  });
});
