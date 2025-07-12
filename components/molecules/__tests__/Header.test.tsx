import React from 'react';

import { render, fireEvent } from '@testing-library/react-native';
import { View } from 'react-native';

import Header from '../Header';

describe('Header', () => {
  const defaultProps = {};

  it('renders correctly with default props', () => {
    const { getByTestId } = render(<Header {...defaultProps} />);
    expect(getByTestId('header')).toBeTruthy();
  });

  it('renders with title', () => {
    const { getByText } = render(
      <Header {...defaultProps} title="My Header" />,
    );
    expect(getByText('My Header')).toBeTruthy();
  });

  it('renders back button when onBackPress is provided', () => {
    const onBackPress = jest.fn();
    const { getByTestId } = render(
      <Header {...defaultProps} onBackPress={onBackPress} />,
    );
    expect(getByTestId('back-button')).toBeTruthy();
  });

  it('calls onBackPress when back button is pressed', () => {
    const onBackPress = jest.fn();
    const { getByTestId } = render(
      <Header {...defaultProps} onBackPress={onBackPress} />,
    );

    const backButton = getByTestId('back-button');
    fireEvent.press(backButton);

    expect(onBackPress).toHaveBeenCalledTimes(1);
  });

  it('renders right button when onRightPress is provided', () => {
    const onRightPress = jest.fn();
    const { getByTestId } = render(
      <Header
        {...defaultProps}
        onRightPress={onRightPress}
        rightIcon="settings"
      />,
    );
    expect(getByTestId('right-button')).toBeTruthy();
  });

  it('calls onRightPress when right button is pressed', () => {
    const onRightPress = jest.fn();
    const { getByTestId } = render(
      <Header
        {...defaultProps}
        onRightPress={onRightPress}
        rightIcon="settings"
      />,
    );

    const rightButton = getByTestId('right-button');
    fireEvent.press(rightButton);

    expect(onRightPress).toHaveBeenCalledTimes(1);
  });

  it('renders with custom right icon', () => {
    const onRightPress = jest.fn();
    const { getByTestId } = render(
      <Header
        {...defaultProps}
        onRightPress={onRightPress}
        rightIcon="heart"
      />,
    );
    expect(getByTestId('right-button')).toBeTruthy();
  });

  it('renders with custom right icon color', () => {
    const onRightPress = jest.fn();
    const { getByTestId } = render(
      <Header
        {...defaultProps}
        onRightPress={onRightPress}
        rightIcon="heart"
        rightIconColor="red"
      />,
    );
    expect(getByTestId('right-button')).toBeTruthy();
  });

  it('renders with custom right icon size', () => {
    const onRightPress = jest.fn();
    const { getByTestId } = render(
      <Header
        {...defaultProps}
        onRightPress={onRightPress}
        rightIcon="heart"
        rightIconSize={32}
      />,
    );
    expect(getByTestId('right-button')).toBeTruthy();
  });

  it('renders with left component', () => {
    const leftComponent = <View testID="custom-left">Custom Left</View>;
    const { getByTestId } = render(
      <Header {...defaultProps} leftComponent={leftComponent} />,
    );
    expect(getByTestId('custom-left')).toBeTruthy();
  });

  it('does not render back button when onBackPress is not provided', () => {
    const { queryByTestId } = render(<Header {...defaultProps} />);
    expect(queryByTestId('back-button')).toBeNull();
  });

  it('does not render right button when onRightPress is not provided', () => {
    const { queryByTestId } = render(<Header {...defaultProps} />);
    expect(queryByTestId('right-button')).toBeNull();
  });

  it('renders with all props combined', () => {
    const onBackPress = jest.fn();
    const onRightPress = jest.fn();
    const leftComponent = <View testID="custom-left">Custom Left</View>;

    const { getByText, getByTestId } = render(
      <Header
        {...defaultProps}
        title="Complete Header"
        onBackPress={onBackPress}
        onRightPress={onRightPress}
        rightIcon="settings"
        rightIconColor="blue"
        rightIconSize={28}
        leftComponent={leftComponent}
        className="custom-class"
      />,
    );

    expect(getByText('Complete Header')).toBeTruthy();
    expect(getByTestId('back-button')).toBeTruthy();
    expect(getByTestId('right-button')).toBeTruthy();
    expect(getByTestId('custom-left')).toBeTruthy();
  });

  it('applies custom className', () => {
    const { getByTestId } = render(
      <Header {...defaultProps} className="custom-class" />,
    );
    expect(getByTestId('header')).toBeTruthy();
  });

  it('handles multiple button presses', () => {
    const onBackPress = jest.fn();
    const onRightPress = jest.fn();
    const { getByTestId } = render(
      <Header
        {...defaultProps}
        onBackPress={onBackPress}
        onRightPress={onRightPress}
        rightIcon="settings"
      />,
    );

    const backButton = getByTestId('back-button');
    const rightButton = getByTestId('right-button');

    fireEvent.press(backButton);
    fireEvent.press(backButton);
    fireEvent.press(rightButton);
    fireEvent.press(rightButton);

    expect(onBackPress).toHaveBeenCalledTimes(2);
    expect(onRightPress).toHaveBeenCalledTimes(2);
  });

  it('renders with long title', () => {
    const longTitle =
      'This is a very long header title that should still be displayed properly';
    const { getByText } = render(
      <Header {...defaultProps} title={longTitle} />,
    );
    expect(getByText(longTitle)).toBeTruthy();
  });
});
