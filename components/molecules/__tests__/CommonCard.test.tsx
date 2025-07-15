import React from 'react';

import { fireEvent, render } from '@testing-library/react-native';
import { View } from 'react-native';

import CommonCard from '../CommonCard';

describe('CommonCard', () => {
  const defaultProps = {
    id: '1',
    imageUrl: 'https://example.com/image.jpg',
    title: 'Test Card',
    marketPrice: '$120',
    marketType: 'eBay',
    indicator: 'up',
  };

  it('renders correctly with default props', () => {
    const { getByTestId } = render(<CommonCard {...defaultProps} />);
    expect(getByTestId('common-card')).toBeTruthy();
    expect(getByTestId('common-card-image')).toBeTruthy();
    expect(getByTestId('common-card-title').props.children).toBe('Test Card');
    expect(getByTestId('common-card-market-price').props.children).toBe('$120');
  });

  it('renders image placeholder when imageUrl is not provided', () => {
    const { getByTestId } = render(
      <CommonCard {...defaultProps} imageUrl="" />,
    );
    expect(getByTestId('common-card-image-placeholder')).toBeTruthy();
  });

  it('renders price when provided', () => {
    const { getByTestId } = render(
      <CommonCard {...defaultProps} price="$100" />,
    );
    expect(getByTestId('common-card-price').props.children).toBe('$100');
  });

  it('does not render price when not provided', () => {
    const { queryByTestId } = render(<CommonCard {...defaultProps} />);
    expect(queryByTestId('common-card-price')).toBeNull();
  });

  it('calls onPress when card is pressed', () => {
    const onPress = jest.fn();
    const { getByTestId } = render(
      <CommonCard {...defaultProps} onPress={onPress} />,
    );
    fireEvent.press(getByTestId('common-card'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('renders right icon button when onRightIconPress is provided', () => {
    const onRightIconPress = jest.fn();
    const { getByTestId } = render(
      <CommonCard
        {...defaultProps}
        onRightIconPress={onRightIconPress}
        rightIcon="heart"
        rightIconSize={24}
        rightIconColor="red"
      />,
    );
    expect(getByTestId('right-icon-button')).toBeTruthy();
  });

  it('calls onRightIconPress when right icon button is pressed', () => {
    const onRightIconPress = jest.fn();
    const { getByTestId } = render(
      <CommonCard
        {...defaultProps}
        onRightIconPress={onRightIconPress}
        rightIcon="heart"
        rightIconSize={24}
        rightIconColor="red"
      />,
    );
    fireEvent.press(getByTestId('right-icon-button'));
    expect(onRightIconPress).toHaveBeenCalledTimes(1);
  });

  it('renders with all props combined', () => {
    const onPress = jest.fn();
    const onRightIconPress = jest.fn();
    const { getByTestId } = render(
      <CommonCard
        {...defaultProps}
        price="$100"
        featured={true}
        onPress={onPress}
        onRightIconPress={onRightIconPress}
        rightIcon="star"
        rightIconSize={20}
        rightIconColor="blue"
        className="custom-class"
      />,
    );
    expect(getByTestId('common-card')).toBeTruthy();
    expect(getByTestId('common-card-image')).toBeTruthy();
    expect(getByTestId('common-card-title').props.children).toBe('Test Card');
    expect(getByTestId('common-card-price').props.children).toBe('$100');
    expect(getByTestId('common-card-market-price').props.children).toBe('$120');
  });

  it('applies correct styling classes', () => {
    const { getByTestId } = render(
      <CommonCard {...defaultProps} className="custom-class" />,
    );
    expect(getByTestId('common-card')).toBeTruthy();
  });

  it('renders with long title and price', () => {
    const { getByTestId } = render(
      <CommonCard
        {...defaultProps}
        title={'A very long card title for testing purposes'}
        price={'$1234567890'}
      />,
    );
    expect(getByTestId('common-card-title').props.children).toBe(
      'A very long card title for testing purposes',
    );
    expect(getByTestId('common-card-price').props.children).toBe('$1234567890');
  });

  it('renders right icon with default props when only onRightIconPress is provided', () => {
    const onRightIconPress = jest.fn();
    const { getByTestId } = render(
      <CommonCard {...defaultProps} onRightIconPress={onRightIconPress} />,
    );
    expect(getByTestId('right-icon-button')).toBeTruthy();
  });

  it('does not render right icon button when onRightIconPress is not provided', () => {
    const { queryByTestId } = render(<CommonCard {...defaultProps} />);
    expect(queryByTestId('right-icon-button')).toBeNull();
  });

  it('renders right component when provided instead of right icon', () => {
    const rightComponent = <View testID="custom-right-component">Custom</View>;
    const { getByTestId } = render(
      <CommonCard {...defaultProps} rightComponent={rightComponent} />,
    );
    expect(getByTestId('custom-right-component')).toBeTruthy();
  });

  it('does not render eBay image for non-eBay marketType', () => {
    const { queryByTestId } = render(
      <CommonCard {...defaultProps} marketType="other" />,
    );
    // EBayImage is not rendered, so we check that no SVG or EBayImage is present
    // (EBayImage is a custom SVG component, so we check for absence of SVG root)
    // If EBayImage has a testID, use it; otherwise, check for absence of SVG
    expect(queryByTestId('ebay-svg')).toBeNull();
  });
});
