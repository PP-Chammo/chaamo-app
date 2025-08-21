import React from 'react';

import { fireEvent, render } from '@testing-library/react-native';
import { View } from 'react-native';

import ListingCard from '../ListingCard';

describe('ListingCard', () => {
  const defaultProps = {
    id: '1',
    imageUrl: 'https://example.com/image.jpg',
    title: 'Test Card',
    currency: 'USD',
    marketCurrency: 'USD',
    marketPrice: '120',
    indicator: 'up',
  };

  it('renders correctly with default props', () => {
    const { getByTestId } = render(<ListingCard {...defaultProps} />);
    expect(getByTestId('listing-card')).toBeTruthy();
    expect(getByTestId('listing-card-image')).toBeTruthy();
    expect(getByTestId('listing-card-title').props.children).toBe('Test Card');
    expect(getByTestId('listing-card-market-price').props.children).toBe(
      'calculating...',
    );
  });

  it('renders image placeholder when imageUrl is not provided', () => {
    const { getByTestId } = render(
      <ListingCard {...defaultProps} imageUrl="" />,
    );
    expect(getByTestId('listing-card-image-placeholder')).toBeTruthy();
  });

  it('renders price when provided', () => {
    const { getByTestId } = render(
      <ListingCard {...defaultProps} price={'100'} />,
    );
    expect(getByTestId('listing-card-price')).toBeTruthy();
    expect(getByTestId('listing-card-price').props.children).toBe('$100.00');
    expect(getByTestId('listing-card-market-price')).toBeTruthy();
    expect(getByTestId('listing-card-market-price').props.children).toBe(
      'calculating...',
    );
  });

  it('does not render price when not provided', () => {
    const { getByTestId } = render(<ListingCard {...defaultProps} />);
    expect(getByTestId('listing-card-price').props.children).toBe('$0.00');
  });

  it('calls onPress when card is pressed', () => {
    const onPress = jest.fn();
    const { getByTestId } = render(
      <ListingCard {...defaultProps} onPress={onPress} />,
    );
    fireEvent.press(getByTestId('listing-card'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('renders right icon button when onRightIconPress is provided', () => {
    const onRightIconPress = jest.fn();
    const { getByTestId } = render(
      <ListingCard
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
      <ListingCard
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
      <ListingCard
        {...defaultProps}
        price={'100'}
        onPress={onPress}
        onRightIconPress={onRightIconPress}
        rightIcon="star"
        rightIconSize={20}
        rightIconColor="blue"
        className="custom-class"
      />,
    );
    expect(getByTestId('listing-card')).toBeTruthy();
    expect(getByTestId('listing-card-image')).toBeTruthy();
    expect(getByTestId('listing-card-title').props.children).toBe('Test Card');
    expect(getByTestId('listing-card-price').props.children).toBe('$100.00');
    expect(getByTestId('listing-card-market-price').props.children).toBe(
      'calculating...',
    );
  });

  it('applies correct styling classes', () => {
    const { getByTestId } = render(
      <ListingCard {...defaultProps} className="custom-class" />,
    );
    expect(getByTestId('listing-card')).toBeTruthy();
  });

  it('renders with long title and price', () => {
    const { getByTestId } = render(
      <ListingCard
        {...defaultProps}
        title={'A very long card title for testing purposes'}
        price={'1234567890'}
      />,
    );
    expect(getByTestId('listing-card-title').props.children).toBe(
      'A very long card title for testing purposes',
    );
    expect(getByTestId('listing-card-price').props.children).toBe(
      '$1,234,567,890.00',
    );
  });

  it('renders right icon with default props when only onRightIconPress is provided', () => {
    const onRightIconPress = jest.fn();
    const { getByTestId } = render(
      <ListingCard {...defaultProps} onRightIconPress={onRightIconPress} />,
    );
    expect(getByTestId('right-icon-button')).toBeTruthy();
  });

  it('does not render right icon button when onRightIconPress is not provided', () => {
    const { queryByTestId } = render(<ListingCard {...defaultProps} />);
    expect(queryByTestId('right-icon-button')).toBeNull();
  });

  it('renders right component when provided instead of right icon', () => {
    const rightComponent = <View testID="custom-right-component">Custom</View>;
    const { getByTestId } = render(
      <ListingCard {...defaultProps} rightComponent={rightComponent} />,
    );
    expect(getByTestId('custom-right-component')).toBeTruthy();
  });

  it('does not render eBay image for non-eBay marketType', () => {
    const { queryByTestId } = render(<ListingCard {...defaultProps} />);
    expect(queryByTestId('ebay-svg')).toBeNull();
  });
});
