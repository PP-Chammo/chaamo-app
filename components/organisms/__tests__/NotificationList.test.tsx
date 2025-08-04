import React from 'react';

import { fireEvent, render } from '@testing-library/react-native';

import { FlatData, Notification } from '@/domains';

import NotificationList from '../NotificationList';

const mockNotifications: FlatData<Notification>[] = [
  { type: 'date', date: '2023-01-01' },
  {
    type: 'group',
    group: {
      id: 1,
      content: 'Test notification',
      notification_types: { name: 'Order Shipped' },
      created_at: '2023-01-01',
    },
    date: '2023-01-01',
  },
];

describe('NotificationList', () => {
  const onPressMock = jest.fn();
  const onLongPressMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    const { getByTestId } = render(
      <NotificationList
        notifications={mockNotifications}
        onPress={onPressMock}
        onLongPress={onLongPressMock}
      />,
    );
    expect(getByTestId('notification-list')).toBeTruthy();
  });

  it('renders notification list items', () => {
    const { getAllByTestId } = render(
      <NotificationList
        notifications={mockNotifications}
        onPress={onPressMock}
        onLongPress={onLongPressMock}
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
        onLongPress={onLongPressMock}
      />,
    );
    expect(getByText('Jan 1, 2023')).toBeTruthy();
  });

  it('calls onPress when a notification is pressed', () => {
    const { getAllByTestId } = render(
      <NotificationList
        notifications={mockNotifications}
        onPress={onPressMock}
        onLongPress={onLongPressMock}
      />,
    );
    const items = getAllByTestId('notification-list-item');
    fireEvent.press(items[0]);
    expect(onPressMock).toHaveBeenCalled();
  });

  it('calls onLongPress when a notification is long pressed', () => {
    const { getAllByTestId } = render(
      <NotificationList
        notifications={mockNotifications}
        onPress={onPressMock}
        onLongPress={onLongPressMock}
      />,
    );
    const items = getAllByTestId('notification-list-item');
    fireEvent(items[0], 'longPress');
    expect(onLongPressMock).toHaveBeenCalled();
  });

  it('calls both onPress and onLongPress when both events occur', () => {
    const { getAllByTestId } = render(
      <NotificationList
        notifications={mockNotifications}
        onPress={onPressMock}
        onLongPress={onLongPressMock}
      />,
    );
    const items = getAllByTestId('notification-list-item');

    fireEvent.press(items[0]);
    fireEvent(items[0], 'longPress');

    expect(onPressMock).toHaveBeenCalledTimes(1);
    expect(onLongPressMock).toHaveBeenCalledTimes(1);
  });

  it('handles multiple interactions with different notifications', () => {
    const multipleNotifications: FlatData<Notification>[] = [
      { type: 'date', date: '2023-01-01' },
      {
        type: 'group',
        group: {
          id: 1,
          content: 'Test notification',
          notification_types: { name: 'Order Shipped' },
          created_at: '2023-01-01',
        },
        date: '2023-01-01',
      },
      {
        type: 'group',
        group: {
          id: 2,
          content: 'Test notification',
          notification_types: { name: 'Order Shipped' },
          created_at: '2023-01-01',
        },
        date: '2023-01-01',
      },
    ];

    const { getAllByTestId } = render(
      <NotificationList
        notifications={multipleNotifications}
        onPress={onPressMock}
        onLongPress={onLongPressMock}
      />,
    );
    const items = getAllByTestId('notification-list-item');

    // Test multiple notifications
    fireEvent.press(items[0]);
    fireEvent(items[0], 'longPress');
    fireEvent.press(items[1]);
    fireEvent(items[1], 'longPress');

    expect(onPressMock).toHaveBeenCalledTimes(2);
    expect(onLongPressMock).toHaveBeenCalledTimes(2);
  });
});
