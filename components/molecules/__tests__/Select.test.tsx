import React from 'react';

import { fireEvent, render } from '@testing-library/react-native';

import Select from '../Select';

const options = [
  { label: 'Option 1', value: '1' },
  { label: 'Option 2', value: '2' },
  { label: 'Option 3', value: '3' },
];

describe('Select', () => {
  it('renders label and required indicator', () => {
    const { getAllByText } = render(
      <Select
        label="Test Label"
        required
        name="test"
        value=""
        onChange={jest.fn()}
        options={options}
      />,
    );
    expect(getAllByText(/Test Label/).length).toBeGreaterThan(0);
    expect(getAllByText('*').length).toBeGreaterThan(0);
  });

  it('renders placeholder when no value is selected', () => {
    const { getByText } = render(
      <Select
        placeholder="Select an option"
        name="test"
        value=""
        onChange={jest.fn()}
        options={options}
      />,
    );
    expect(getByText('Select an option')).toBeTruthy();
  });

  it('renders selected label when value is provided', () => {
    const { getByText } = render(
      <Select name="test" value="2" onChange={jest.fn()} options={options} />,
    );
    expect(getByText('Option 2')).toBeTruthy();
  });

  it('opens and closes dropdown on press', () => {
    const { getByTestId, getByText, queryByText } = render(
      <Select name="test" value="" onChange={jest.fn()} options={options} />,
    );
    const select = getByTestId('select');
    fireEvent.press(select);
    expect(getByText('Option 1')).toBeTruthy();
    fireEvent.press(select);
    expect(queryByText('Option 1')).toBeNull();
  });

  it('calls onChange and closes dropdown when option is selected', () => {
    const onChange = jest.fn();
    const { getByTestId, getByText, queryByText } = render(
      <Select name="test" value="" onChange={onChange} options={options} />,
    );
    fireEvent.press(getByTestId('select'));
    fireEvent.press(getByText('Option 3'));
    expect(onChange).toHaveBeenCalledWith({ name: 'test', value: '3' });
    expect(queryByText('Option 1')).toBeNull();
  });

  it('renders error message if error prop is provided', () => {
    const { getByText } = render(
      <Select
        name="test"
        value=""
        onChange={jest.fn()}
        options={options}
        error="This is an error"
      />,
    );
    expect(getByText('This is an error')).toBeTruthy();
  });

  it('renders with custom className and inputClassName', () => {
    const { getByTestId } = render(
      <Select
        name="test"
        value=""
        onChange={jest.fn()}
        options={options}
        className="custom-class"
        inputClassName="custom-input-class"
      />,
    );
    expect(getByTestId('select')).toBeTruthy();
  });

  it('handles empty options array gracefully', () => {
    const { getByTestId, queryByText } = render(
      <Select name="test" value="" onChange={jest.fn()} options={[]} />,
    );
    fireEvent.press(getByTestId('select'));
    expect(queryByText('Option 1')).toBeNull();
  });
});
