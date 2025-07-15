import React from 'react';

import { fireEvent, render } from '@testing-library/react-native';

import FilterPriceRangeInput from '../FilterPriceRangeInput';

describe('FilterPriceRangeInput', () => {
  const defaultProps = {
    value: '0,Any',
    onChange: jest.fn(),
  };

  it('renders correctly with default props', () => {
    const { getByTestId, getByText } = render(
      <FilterPriceRangeInput {...defaultProps} />,
    );
    expect(getByTestId('filter-price-range-input')).toBeTruthy();
    expect(getByTestId('filter-price-min-input')).toBeTruthy();
    expect(getByTestId('filter-price-max-input')).toBeTruthy();
    expect(getByText('Price Range')).toBeTruthy();
    expect(getByText('to')).toBeTruthy();
  });

  it('renders with custom price range', () => {
    const { getByTestId } = render(
      <FilterPriceRangeInput {...defaultProps} value="100,500" />,
    );
    expect(getByTestId('filter-price-min-input').props.value).toBe('100');
    expect(getByTestId('filter-price-max-input').props.value).toBe('500');
  });

  it('calls onChange when min price is changed', () => {
    const onChange = jest.fn();
    const { getByTestId } = render(
      <FilterPriceRangeInput {...defaultProps} onChange={onChange} />,
    );
    const minInput = getByTestId('filter-price-min-input');
    fireEvent.changeText(minInput, '200');
    expect(onChange).toHaveBeenCalledWith('200,Any');
  });

  it('calls onChange when max price is changed', () => {
    const onChange = jest.fn();
    const { getByTestId } = render(
      <FilterPriceRangeInput {...defaultProps} onChange={onChange} />,
    );
    const maxInput = getByTestId('filter-price-max-input');
    fireEvent.changeText(maxInput, '1000');
    expect(onChange).toHaveBeenCalledWith('0,1000');
  });

  it('renders with empty value', () => {
    const { getByTestId } = render(
      <FilterPriceRangeInput {...defaultProps} value="" />,
    );
    expect(getByTestId('filter-price-min-input').props.value).toBe('');
    expect(getByTestId('filter-price-max-input').props.value).toBe('');
  });
});
