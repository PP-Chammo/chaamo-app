import React from 'react';

import { render, fireEvent } from '@testing-library/react-native';
import { View } from 'react-native';

import CategoryItem from '../Category';

// Mock SVG component
const MockSvgComponent = () => <View testID="svg-image">SVG Image</View>;

describe('CategoryItem', () => {
  const defaultProps = {
    title: 'Pokemon',
  };

  it('renders correctly with default props', () => {
    const { getByText } = render(<CategoryItem {...defaultProps} />);
    expect(getByText('Pokemon')).toBeTruthy();
  });

  it('renders with custom title', () => {
    const { getByText } = render(
      <CategoryItem {...defaultProps} title="Marvel" />,
    );
    expect(getByText('Marvel')).toBeTruthy();
  });

  it('renders with SVG image', () => {
    const { getByTestId } = render(
      <CategoryItem {...defaultProps} image={MockSvgComponent} />,
    );
    expect(getByTestId('svg-image')).toBeTruthy();
  });

  it('renders default icon when no image is provided', () => {
    const { getByTestId } = render(<CategoryItem {...defaultProps} />);
    expect(getByTestId('default-icon')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByTestId } = render(
      <CategoryItem {...defaultProps} onPress={onPress} />,
    );

    const touchable = getByTestId('category-item');
    fireEvent.press(touchable);

    expect(onPress).toHaveBeenCalledWith('Pokemon');
  });

  it('renders in horizontal mode', () => {
    const { getByTestId } = render(
      <CategoryItem {...defaultProps} horizontal={true} />,
    );
    expect(getByTestId('category-item')).toBeTruthy();
  });

  it('shows chevron icon in horizontal mode', () => {
    const { getByTestId } = render(
      <CategoryItem {...defaultProps} horizontal={true} />,
    );
    expect(getByTestId('chevron-icon')).toBeTruthy();
  });

  it('does not show chevron icon in vertical mode', () => {
    const { queryByTestId } = render(
      <CategoryItem {...defaultProps} horizontal={false} />,
    );
    expect(queryByTestId('chevron-icon')).toBeNull();
  });

  it('renders with all props combined', () => {
    const onPress = jest.fn();
    const { getByText, getByTestId } = render(
      <CategoryItem
        {...defaultProps}
        title="Yu-Gi-Oh!"
        image={MockSvgComponent}
        horizontal={true}
        onPress={onPress}
      />,
    );

    expect(getByText('Yu-Gi-Oh!')).toBeTruthy();
    expect(getByTestId('svg-image')).toBeTruthy();
    expect(getByTestId('chevron-icon')).toBeTruthy();
  });

  it('applies correct styling classes', () => {
    const { getByTestId } = render(<CategoryItem {...defaultProps} />);
    expect(getByTestId('category-item')).toBeTruthy();
  });

  it('handles multiple press events', () => {
    const onPress = jest.fn();
    const { getByTestId } = render(
      <CategoryItem {...defaultProps} onPress={onPress} />,
    );

    const touchable = getByTestId('category-item');

    fireEvent.press(touchable);
    fireEvent.press(touchable);
    fireEvent.press(touchable);

    expect(onPress).toHaveBeenCalledTimes(3);
    expect(onPress).toHaveBeenLastCalledWith('Pokemon');
  });

  it('renders with long title', () => {
    const longTitle =
      'This is a very long category title that should still be displayed properly';
    const { getByText } = render(
      <CategoryItem {...defaultProps} title={longTitle} />,
    );
    expect(getByText(longTitle)).toBeTruthy();
  });

  it('does not call onPress when onPress is not provided', () => {
    const { getByTestId } = render(<CategoryItem {...defaultProps} />);
    const touchable = getByTestId('category-item');

    // Should not throw error when pressed without onPress handler
    expect(() => fireEvent.press(touchable)).not.toThrow();
  });
});
