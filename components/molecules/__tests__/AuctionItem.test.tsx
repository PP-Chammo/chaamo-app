import React from 'react';

import { render, fireEvent } from '@testing-library/react-native';

import AuctionItem from '../AuctionItem';

describe('AuctionItem', () => {
  const defaultProps = {
    imageUrl: 'https://example.com/image.jpg',
    title: 'Test Auction',
    subtitle: 'Test Subtitle',
    price: '$100',
    date: new Date().toISOString(),
    marketPrice: '$120',
    marketType: 'eBay',
    indicator: 'up',
  };

  it('renders correctly with default props', () => {
    const { getByTestId, getByText } = render(
      <AuctionItem {...defaultProps} />,
    );
    expect(getByTestId('auction-item')).toBeTruthy();
    expect(getByTestId('auction-item-image')).toBeTruthy();
    expect(getByTestId('auction-item-title').props.children).toBe(
      'Test Auction',
    );
    expect(getByTestId('auction-item-subtitle').props.children).toBe(
      'Test Subtitle',
    );
    expect(getByTestId('auction-item-price').props.children).toBe('$100');
    expect(getByTestId('auction-item-market-price').props.children).toBe(
      '$120',
    );
    expect(getByText('Highest Bid')).toBeTruthy();
    expect(getByTestId('auction-item-date')).toBeTruthy();
  });

  it('renders image placeholder when imageUrl is not provided', () => {
    const { getByTestId } = render(
      <AuctionItem {...defaultProps} imageUrl="" />,
    );
    expect(getByTestId('auction-item-image-placeholder')).toBeTruthy();
  });

  it('calls onPress when item is pressed', () => {
    const onPress = jest.fn();
    const { getByTestId } = render(
      <AuctionItem {...defaultProps} onPress={onPress} />,
    );
    fireEvent.press(getByTestId('auction-item'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('renders right icon button when onRightIconPress is provided', () => {
    const onRightIconPress = jest.fn();
    const { getByTestId } = render(
      <AuctionItem
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
      <AuctionItem
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
    const { getByTestId, getByText } = render(
      <AuctionItem
        {...defaultProps}
        onPress={onPress}
        onRightIconPress={onRightIconPress}
        rightIcon="star"
        rightIconSize={20}
        rightIconColor="blue"
        rightIconVariant="FontAwesome6"
        className="custom-class"
      />,
    );
    expect(getByTestId('auction-item')).toBeTruthy();
    expect(getByTestId('auction-item-image')).toBeTruthy();
    expect(getByTestId('auction-item-title').props.children).toBe(
      'Test Auction',
    );
    expect(getByTestId('auction-item-subtitle').props.children).toBe(
      'Test Subtitle',
    );
    expect(getByTestId('auction-item-price').props.children).toBe('$100');
    expect(getByTestId('auction-item-market-price').props.children).toBe(
      '$120',
    );
    expect(getByText('Highest Bid')).toBeTruthy();
    expect(getByTestId('auction-item-date')).toBeTruthy();
  });

  it('applies correct styling classes', () => {
    const { getByTestId } = render(
      <AuctionItem {...defaultProps} className="custom-class" />,
    );
    expect(getByTestId('auction-item')).toBeTruthy();
  });

  it('renders with long title and price', () => {
    const { getByTestId } = render(
      <AuctionItem
        {...defaultProps}
        title={'A very long auction title for testing purposes'}
        price={'$1234567890'}
      />,
    );
    expect(getByTestId('auction-item-title').props.children).toBe(
      'A very long auction title for testing purposes',
    );
    expect(getByTestId('auction-item-price').props.children).toBe(
      '$1234567890',
    );
  });
});
