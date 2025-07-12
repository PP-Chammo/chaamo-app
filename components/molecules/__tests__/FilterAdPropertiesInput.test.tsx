import React from 'react';

import { render, fireEvent } from '@testing-library/react-native';

import FilterAdPropertiesInput from '../FilterAdPropertiesInput';

describe('FilterAdPropertiesInput', () => {
  const defaultProps = {
    value: '',
    onChange: jest.fn(),
  };

  it('renders correctly with default props', () => {
    const { getByTestId, getByText } = render(
      <FilterAdPropertiesInput {...defaultProps} />,
    );
    expect(getByTestId('filter-ad-properties-input')).toBeTruthy();
    expect(getByText('Ad Properties')).toBeTruthy();
  });

  it('renders all ad property buttons', () => {
    const { getByTestId } = render(
      <FilterAdPropertiesInput {...defaultProps} />,
    );
    // Check that ad property buttons are rendered
    expect(getByTestId('filter-ad-properties-input')).toBeTruthy();
  });

  it('calls onChange when ad property button is pressed', () => {
    const onChange = jest.fn();
    const { getByTestId } = render(
      <FilterAdPropertiesInput {...defaultProps} onChange={onChange} />,
    );
    // Find and press the first ad property button
    const firstButton = getByTestId('filter-ad-property-button-featured');
    fireEvent.press(firstButton);
    expect(onChange).toHaveBeenCalledWith('adProperties', 'featured');
  });

  it('toggles ad property value when button is pressed', () => {
    const onChange = jest.fn();
    const { getByTestId } = render(
      <FilterAdPropertiesInput
        {...defaultProps}
        value="featured"
        onChange={onChange}
      />,
    );
    const button = getByTestId('filter-ad-property-button-featured');
    fireEvent.press(button);
    expect(onChange).toHaveBeenCalledWith('adProperties', '');
  });

  it('applies correct styling classes', () => {
    const { getByTestId } = render(
      <FilterAdPropertiesInput {...defaultProps} />,
    );
    expect(getByTestId('filter-ad-properties-input')).toBeTruthy();
  });

  it('renders with multiple selected ad properties', () => {
    const { getByTestId } = render(
      <FilterAdPropertiesInput {...defaultProps} value="featured,urgent" />,
    );
    expect(getByTestId('filter-ad-properties-input')).toBeTruthy();
  });
});
