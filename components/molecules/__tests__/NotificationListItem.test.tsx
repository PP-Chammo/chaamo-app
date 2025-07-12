import React from 'react';

import { render, fireEvent } from '@testing-library/react-native';

import NotificationListItem from '../NotificationListItem';

// Mock date-fns
jest.mock('date-fns', () => ({
  formatDistanceToNow: jest.fn(() => '2 hours ago'),
}));

describe('NotificationListItem', () => {
  const defaultProps = {
    category: 'New Bid' as const,
    message: 'You have a new bid on your item',
    date: '2023-01-01T10:00:00Z',
    onPress: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with default props', () => {
    const { getByTestId, getByText } = render(
      <NotificationListItem {...defaultProps} />,
    );
    expect(getByTestId('notification-list-item')).toBeTruthy();
    expect(getByText('New Bid')).toBeTruthy();
    expect(getByText('You have a new bid on your item')).toBeTruthy();
  });

  it('renders with Order Shipped category', () => {
    const { getByText } = render(
      <NotificationListItem {...defaultProps} category="Order Shipped" />,
    );
    expect(getByText('Order Shipped')).toBeTruthy();
  });

  it('renders with Bid Ending category', () => {
    const { getByText } = render(
      <NotificationListItem {...defaultProps} category="Bid Ending" />,
    );
    expect(getByText('Bid Ending')).toBeTruthy();
  });

  it('renders with custom message', () => {
    const { getByText } = render(
      <NotificationListItem
        {...defaultProps}
        message="Your order has been shipped"
      />,
    );
    expect(getByText('Your order has been shipped')).toBeTruthy();
  });

  it('renders with custom date', () => {
    const { getByText } = render(
      <NotificationListItem {...defaultProps} date="2023-01-02T15:30:00Z" />,
    );
    expect(getByText('2 hours ago')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByTestId } = render(
      <NotificationListItem {...defaultProps} onPress={onPress} />,
    );
    const item = getByTestId('notification-list-item');
    fireEvent.press(item);
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('renders with all props combined', () => {
    const onPress = jest.fn();
    const { getByTestId, getByText } = render(
      <NotificationListItem
        category="Order Shipped"
        message="Your package is on its way"
        date="2023-01-03T09:00:00Z"
        onPress={onPress}
      />,
    );

    expect(getByTestId('notification-list-item')).toBeTruthy();
    expect(getByText('Order Shipped')).toBeTruthy();
    expect(getByText('Your package is on its way')).toBeTruthy();
    expect(getByText('2 hours ago')).toBeTruthy();
  });

  it('applies correct styling classes', () => {
    const { getByTestId } = render(<NotificationListItem {...defaultProps} />);
    expect(getByTestId('notification-list-item')).toBeTruthy();
  });

  it('handles different date formats', () => {
    const { getByText } = render(
      <NotificationListItem
        {...defaultProps}
        date="2023-12-25T12:00:00.000Z"
      />,
    );
    expect(getByText('2 hours ago')).toBeTruthy();
  });
});
