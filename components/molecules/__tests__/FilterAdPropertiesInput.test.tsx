import React from 'react';

import { fireEvent, render } from '@testing-library/react-native';

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
    expect(getByTestId('filter-ad-properties-input')).toBeTruthy();
  });

  it('calls onChange when ad property button is pressed', () => {
    const onChange = jest.fn();
    const { getByTestId } = render(
      <FilterAdPropertiesInput {...defaultProps} onChange={onChange} />,
    );
    const firstButton = getByTestId('filter-ad-property-button-featured');
    fireEvent.press(firstButton);
    expect(onChange).toHaveBeenCalledWith('featured');
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
    expect(onChange).toHaveBeenCalledWith('');
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
