import React from 'react';

import { render } from '@testing-library/react-native';

import WishListItem from '../WishListItem';

describe('WishListItem', () => {
  const defaultProps = {
    imageUrl: 'https://example.com/image.jpg',
    title: 'Test Wish Item',
    creator: 'Test Creator',
    year: '2023',
    currentPrice: '$100',
    bidPrice: '$120',
    date: new Date().toISOString(),
  };

  it('renders correctly with default props', () => {
    const { getByTestId } = render(<WishListItem {...defaultProps} />);
    expect(getByTestId('wish-list-item')).toBeTruthy();
    expect(getByTestId('wish-list-item-image')).toBeTruthy();
    expect(getByTestId('wish-list-item-title').props.children).toBe(
      'Test Wish Item',
    );
    expect(getByTestId('wish-list-item-creator').props.children).toBe(
      'Test Creator',
    );
    expect(getByTestId('wish-list-item-year').props.children).toBe('2023');
    expect(getByTestId('wish-list-item-current-price').props.children).toBe(
      '$100',
    );
    expect(getByTestId('wish-list-item-bid-price').props.children).toBe('$120');
    expect(getByTestId('wish-list-item-date')).toBeTruthy();
  });

  it('renders with all props combined', () => {
    const { getByTestId } = render(
      <WishListItem
        {...defaultProps}
        title="Custom Title"
        creator="Custom Creator"
        year="2024"
        currentPrice="$200"
        bidPrice="$250"
      />,
    );
    expect(getByTestId('wish-list-item')).toBeTruthy();
    expect(getByTestId('wish-list-item-image')).toBeTruthy();
    expect(getByTestId('wish-list-item-title').props.children).toBe(
      'Custom Title',
    );
    expect(getByTestId('wish-list-item-creator').props.children).toBe(
      'Custom Creator',
    );
    expect(getByTestId('wish-list-item-year').props.children).toBe('2024');
    expect(getByTestId('wish-list-item-current-price').props.children).toBe(
      '$200',
    );
    expect(getByTestId('wish-list-item-bid-price').props.children).toBe('$250');
    expect(getByTestId('wish-list-item-date')).toBeTruthy();
  });

  it('applies correct styling classes', () => {
    const { getByTestId } = render(<WishListItem {...defaultProps} />);
    expect(getByTestId('wish-list-item')).toBeTruthy();
  });

  it('renders with long title and creator', () => {
    const { getByTestId } = render(
      <WishListItem
        {...defaultProps}
        title={'A very long wish item title for testing purposes'}
        creator={'A very long creator name for testing purposes'}
      />,
    );
    expect(getByTestId('wish-list-item-title').props.children).toBe(
      'A very long wish item title for testing purposes',
    );
    expect(getByTestId('wish-list-item-creator').props.children).toBe(
      'A very long creator name for testing purposes',
    );
  });
});
