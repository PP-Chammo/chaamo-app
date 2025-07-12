import React from 'react';

import { render, fireEvent } from '@testing-library/react-native';

import HeaderSearch from '../HeaderSearch';

describe('HeaderSearch', () => {
  const defaultProps = {
    value: '',
    onChange: jest.fn(),
  };

  it('renders correctly with default props', () => {
    const { getByTestId } = render(<HeaderSearch {...defaultProps} />);
    expect(getByTestId('header-search')).toBeTruthy();
  });

  it('renders with initial value', () => {
    const { getByTestId } = render(
      <HeaderSearch {...defaultProps} value="search term" />,
    );
    expect(getByTestId('header-search')).toBeTruthy();
  });

  it('calls onChange when search field changes', () => {
    const onChange = jest.fn();
    const { getByTestId } = render(
      <HeaderSearch {...defaultProps} onChange={onChange} />,
    );

    const searchField = getByTestId('search-field');
    const textInput = searchField.findByType('TextInput');
    fireEvent.changeText(textInput, 'new search');

    expect(onChange).toHaveBeenCalledWith({
      name: 'search',
      value: 'new search',
    });
  });

  it('renders back button when onBackPress is provided', () => {
    const onBackPress = jest.fn();
    const { getByTestId } = render(
      <HeaderSearch {...defaultProps} onBackPress={onBackPress} />,
    );
    expect(getByTestId('back-button')).toBeTruthy();
  });

  it('calls onBackPress when back button is pressed', () => {
    const onBackPress = jest.fn();
    const { getByTestId } = render(
      <HeaderSearch {...defaultProps} onBackPress={onBackPress} />,
    );

    const backButton = getByTestId('back-button');
    fireEvent.press(backButton);

    expect(onBackPress).toHaveBeenCalledTimes(1);
  });

  it('does not render back button when onBackPress is not provided', () => {
    const { queryByTestId } = render(<HeaderSearch {...defaultProps} />);
    expect(queryByTestId('back-button')).toBeNull();
  });

  it('calls onSubmit when search is submitted', () => {
    const onSubmit = jest.fn();
    const { getByTestId } = render(
      <HeaderSearch {...defaultProps} onSubmit={onSubmit} />,
    );

    const searchField = getByTestId('search-field');
    const textInput = searchField.findByType('TextInput');
    fireEvent(textInput, 'submitEditing');

    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it('applies custom className', () => {
    const { getByTestId } = render(
      <HeaderSearch {...defaultProps} className="custom-class" />,
    );
    expect(getByTestId('header-search')).toBeTruthy();
  });

  it('renders with all props combined', () => {
    const onChange = jest.fn();
    const onBackPress = jest.fn();
    const onSubmit = jest.fn();

    const { getByTestId } = render(
      <HeaderSearch
        {...defaultProps}
        value="test search"
        onChange={onChange}
        onBackPress={onBackPress}
        onSubmit={onSubmit}
        className="custom-class"
      />,
    );

    expect(getByTestId('header-search')).toBeTruthy();
    expect(getByTestId('back-button')).toBeTruthy();
    expect(getByTestId('search-field')).toBeTruthy();
  });

  it('handles multiple search changes', () => {
    const onChange = jest.fn();
    const { getByTestId } = render(
      <HeaderSearch {...defaultProps} onChange={onChange} />,
    );

    const searchField = getByTestId('search-field');
    const textInput = searchField.findByType('TextInput');

    fireEvent.changeText(textInput, 'a');
    fireEvent.changeText(textInput, 'ab');
    fireEvent.changeText(textInput, 'abc');

    expect(onChange).toHaveBeenCalledTimes(3);
    expect(onChange).toHaveBeenLastCalledWith({ name: 'search', value: 'abc' });
  });

  it('applies correct styling classes', () => {
    const { getByTestId } = render(<HeaderSearch {...defaultProps} />);
    expect(getByTestId('header-search')).toBeTruthy();
  });
});
