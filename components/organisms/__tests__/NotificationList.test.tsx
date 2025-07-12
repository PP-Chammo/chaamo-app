import React from 'react';

import { render, fireEvent } from '@testing-library/react-native';

import { FlatData } from '@/domains/group-data.types';
import { Notification } from '@/utils/notification';

import NotificationList from '../NotificationList';

const mockNotifications: FlatData<Notification>[] = [
  { type: 'date', date: '2023-01-01' },
  {
    type: 'group',
    group: {
      id: 1,
      category: 'Order Shipped',
      message: 'Test notification',
      date: '2023-01-01',
    },
    date: '2023-01-01',
  },
];

describe('NotificationList', () => {
  const onPressMock = jest.fn();

  it('renders correctly', () => {
    const { getByTestId } = render(
      <NotificationList
        notifications={mockNotifications}
        onPress={onPressMock}
      />,
    );
    expect(getByTestId('notification-list')).toBeTruthy();
  });

  it('renders notification list items', () => {
    const { getAllByTestId } = render(
      <NotificationList
        notifications={mockNotifications}
        onPress={onPressMock}
      />,
    );
    const items = getAllByTestId('notification-list-item');
    expect(items.length).toBe(1);
  });

  it('renders date label', () => {
    const { getByText } = render(
      <NotificationList
        notifications={mockNotifications}
        onPress={onPressMock}
      />,
    );
    expect(getByText('Jan 1, 2023')).toBeTruthy();
  });

  it('calls onPress when a notification is pressed', () => {
    const { getAllByTestId } = render(
      <NotificationList
        notifications={mockNotifications}
        onPress={onPressMock}
      />,
    );
    const items = getAllByTestId('notification-list-item');
    fireEvent.press(items[0]);
    expect(onPressMock).toHaveBeenCalled();
  });
});
