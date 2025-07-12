import { groupNotificationsByDate, Notification } from '../notification';

describe('groupNotificationsByDate', () => {
  it('should return empty array for empty input', () => {
    expect(groupNotificationsByDate([])).toEqual([]);
  });

  it('should handle a single notification', () => {
    const notifications: Notification[] = [
      {
        id: 1,
        category: 'Order Shipped',
        message: 'Shipped!',
        date: '2024-06-01T10:00:00Z',
      },
    ];
    const result = groupNotificationsByDate(notifications);
    expect(result).toHaveLength(1);
    expect(result[0].notifications).toHaveLength(1);
  });

  it('should group notifications by date', () => {
    const notifications: Notification[] = [
      {
        id: 1,
        category: 'Order Shipped',
        message: 'Shipped!',
        date: '2024-06-01T10:00:00Z',
      },
      {
        id: 2,
        category: 'New Bid',
        message: 'Bid placed!',
        date: '2024-06-01T12:00:00Z',
      },
      {
        id: 3,
        category: 'Bid Ending',
        message: 'Ending soon!',
        date: '2024-06-02T09:00:00Z',
      },
    ];
    const result = groupNotificationsByDate(notifications);
    expect(result).toHaveLength(2);
    expect(result.find((g) => g.date === '2024-06-01')).toBeDefined();
    expect(result.find((g) => g.date === '2024-06-02')).toBeDefined();
  });

  it('should sort dates descending', () => {
    const notifications: Notification[] = [
      {
        id: 1,
        category: 'Order Shipped',
        message: 'Shipped!',
        date: '2024-06-01T10:00:00Z',
      },
      {
        id: 2,
        category: 'Bid Ending',
        message: 'Ending soon!',
        date: '2024-06-02T09:00:00Z',
      },
    ];
    const result = groupNotificationsByDate(notifications);
    expect(result[0].date).toBe('2024-06-02');
    expect(result[1].date).toBe('2024-06-01');
  });
});
