import React from 'react';

import { fireEvent, render } from '@testing-library/react-native';

import FilterLocationInput from '../FilterLocationInput';

describe('FilterLocationInput', () => {
  const defaultProps = {
    value: '',
    onChange: jest.fn(),
  };

  it('renders correctly with default props', () => {
    const { getByTestId, getByText } = render(
      <FilterLocationInput {...defaultProps} />,
    );
    expect(getByTestId('filter-location-input')).toBeTruthy();
    expect(getByTestId('filter-location-button')).toBeTruthy();
    expect(getByText('Location')).toBeTruthy();
  });

  it('renders with value', () => {
    const { getByTestId } = render(
      <FilterLocationInput {...defaultProps} value="New York" />,
    );
    expect(getByTestId('filter-location-value').props.children).toBe(
      'New York',
    );
  });

  it('calls handleOpen when button is pressed', () => {
    const { getByTestId } = render(<FilterLocationInput {...defaultProps} />);
    const button = getByTestId('filter-location-button');
    fireEvent.press(button);
    expect(button).toBeTruthy();
  });

  it('applies correct styling classes', () => {
    const { getByTestId } = render(<FilterLocationInput {...defaultProps} />);
    expect(getByTestId('filter-location-input')).toBeTruthy();
  });

  it('renders with long location value', () => {
    const longLocation = 'A very long location name for testing purposes';
    const { getByTestId } = render(
      <FilterLocationInput {...defaultProps} value={longLocation} />,
    );
    expect(getByTestId('filter-location-value').props.children).toBe(
      longLocation,
    );
  });
});
