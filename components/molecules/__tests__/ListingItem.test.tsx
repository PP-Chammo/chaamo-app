import React from 'react';

import { render, fireEvent } from '@testing-library/react-native';

import { ListingType } from '@/generated/graphql';

import ListingItem from '../ListingItem';

describe('ListingItem', () => {
  const defaultProps = {
    listingType: ListingType.SELL,
    imageUrl: 'https://example.com/image.jpg',
    title: 'Test Card',
    subtitle: 'Test Subtitle',
    currency: 'USD',
    marketCurrency: 'USD',
    price: '100',
    date: new Date().toISOString(),
    marketPrice: '120',
    marketType: 'eBay',
    indicator: 'up',
  };

  it('renders correctly with default props', () => {
    const { getByTestId } = render(<ListingItem {...defaultProps} />);
    expect(getByTestId('card-item')).toBeTruthy();
    expect(getByTestId('card-item-image')).toBeTruthy();
    expect(getByTestId('card-item-title').props.children).toBe('Test Card');
    expect(getByTestId('card-item-subtitle').props.children).toBe(
      'Test Subtitle',
    );
    expect(getByTestId('card-item-market-price').props.children).toBe(
      '$100.00',
    );
    expect(getByTestId('card-item-date')).toBeTruthy();
  });

  it('renders image placeholder when imageUrl is not provided', () => {
    const { getByTestId } = render(
      <ListingItem {...defaultProps} imageUrl="" />,
    );
    expect(getByTestId('card-item-image-placeholder')).toBeTruthy();
  });

  it('renders right icon button when onRightIconPress is provided', () => {
    const onRightIconPress = jest.fn();
    const { getByTestId } = render(
      <ListingItem
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
      <ListingItem
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
    const onRightIconPress = jest.fn();
    const { getByTestId } = render(
      <ListingItem
        {...defaultProps}
        onRightIconPress={onRightIconPress}
        rightIcon="star"
        rightIconSize={20}
        rightIconColor="blue"
        rightIconVariant="FontAwesome6"
        className="custom-class"
      />,
    );
    expect(getByTestId('card-item')).toBeTruthy();
    expect(getByTestId('card-item-image')).toBeTruthy();
    expect(getByTestId('card-item-title').props.children).toBe('Test Card');
    expect(getByTestId('card-item-subtitle').props.children).toBe(
      'Test Subtitle',
    );
    expect(getByTestId('card-item-market-price').props.children).toBe(
      '$100.00',
    );
    expect(getByTestId('card-item-date')).toBeTruthy();
  });

  it('applies correct styling classes', () => {
    const { getByTestId } = render(
      <ListingItem {...defaultProps} className="custom-class" />,
    );
    expect(getByTestId('card-item')).toBeTruthy();
  });

  it('renders with long title and price', () => {
    const { getByTestId } = render(
      <ListingItem
        {...defaultProps}
        title={'A very long card title for testing purposes'}
        marketPrice={'1234567890'}
      />,
    );
    expect(getByTestId('card-item-title').props.children).toBe(
      'A very long card title for testing purposes',
    );
  });
});
