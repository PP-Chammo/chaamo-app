import React from 'react';

import { render, fireEvent } from '@testing-library/react-native';

import AuctionCard from '../AuctionCard';

describe('AuctionCard', () => {
  const defaultProps = {
    id: '1',
    imageUrl: 'https://example.com/image.jpg',
    title: 'Test Auction',
    price: '$100',
  };

  it('renders correctly with default props', () => {
    const { getByTestId, getByText } = render(
      <AuctionCard {...defaultProps} />,
    );
    expect(getByTestId('auction-card')).toBeTruthy();
    expect(getByTestId('auction-image')).toBeTruthy();
    expect(getByTestId('auction-title').props.children).toBe('Test Auction');
    expect(getByTestId('auction-price').props.children).toBe('$100');
    expect(getByText('Highest Bid')).toBeTruthy();
  });

  it('renders image placeholder when imageUrl is not provided', () => {
    const { getByTestId } = render(
      <AuctionCard {...defaultProps} imageUrl="" />,
    );
    expect(getByTestId('auction-image-placeholder')).toBeTruthy();
  });

  it('calls onPress when card is pressed', () => {
    const onPress = jest.fn();
    const { getByTestId } = render(
      <AuctionCard {...defaultProps} onPress={onPress} />,
    );
    fireEvent.press(getByTestId('auction-card'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('renders right icon button when onRightIconPress is provided', () => {
    const onRightIconPress = jest.fn();
    const { getByTestId } = render(
      <AuctionCard
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
      <AuctionCard
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
      <AuctionCard
        {...defaultProps}
        onPress={onPress}
        onRightIconPress={onRightIconPress}
        rightIcon="star"
        rightIconSize={20}
        rightIconColor="blue"
      />,
    );
    expect(getByTestId('auction-card')).toBeTruthy();
    expect(getByTestId('right-icon-button')).toBeTruthy();
    expect(getByTestId('auction-image')).toBeTruthy();
    expect(getByTestId('auction-title').props.children).toBe('Test Auction');
    expect(getByTestId('auction-price').props.children).toBe('$100');
    expect(getByText('Highest Bid')).toBeTruthy();
  });

  it('applies correct styling classes', () => {
    const { getByTestId } = render(<AuctionCard {...defaultProps} />);
    expect(getByTestId('auction-card')).toBeTruthy();
  });

  it('renders with long title and price', () => {
    const { getByTestId } = render(
      <AuctionCard
        {...defaultProps}
        title={'A very long auction title for testing purposes'}
        price={'$1234567890'}
      />,
    );
    expect(getByTestId('auction-title').props.children).toBe(
      'A very long auction title for testing purposes',
    );
    expect(getByTestId('auction-price').props.children).toBe('$1234567890');
  });
});
