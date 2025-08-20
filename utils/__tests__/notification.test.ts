import { BaseNotification } from '@/domains';

import { groupNotificationsByDate } from '../notification';

describe('groupNotificationsByDate', () => {
  it('should return empty array for empty input', () => {
    expect(groupNotificationsByDate([])).toEqual([]);
  });

  it('should handle a single notification', () => {
    const notifications: BaseNotification[] = [
      {
        id: 1,
        content: 'Shipped!',
        created_at: '2024-06-01T10:00:00Z',
        type: 'ORDER_SHIPPED',
      },
    ];
    const result = groupNotificationsByDate(notifications);
    expect(result).toHaveLength(1);
    expect(result[0].notifications).toHaveLength(1);
  });

  it('should group notifications by date', () => {
    const notifications: BaseNotification[] = [
      {
        id: 1,
        content: 'Shipped!',
        created_at: '2024-06-01T10:00:00Z',
        type: 'ORDER_SHIPPED',
      },
      {
        id: 2,
        content: 'Bid placed!',
        created_at: '2024-06-01T12:00:00Z',
        type: 'NEW_BID',
      },
      {
        id: 3,
        content: 'Ending soon!',
        created_at: '2024-06-02T09:00:00Z',
        type: 'BID_ENDING',
      },
    ];
    const result = groupNotificationsByDate(notifications);
    expect(result).toHaveLength(2);
    expect(result.find((g) => g.date === '2024-06-01')).toBeDefined();
    expect(result.find((g) => g.date === '2024-06-02')).toBeDefined();
  });

  it('should sort dates descending', () => {
    const notifications: BaseNotification[] = [
      {
        id: 1,
        content: 'Shipped!',
        created_at: '2024-06-01T10:00:00Z',
        type: 'ORDER_SHIPPED',
      },
      {
        id: 2,
        content: 'Ending soon!',
        created_at: '2024-06-02T09:00:00Z',
        type: 'BID_ENDING',
      },
    ];
    const result = groupNotificationsByDate(notifications);
    expect(result[0].date).toBe('2024-06-02');
    expect(result[1].date).toBe('2024-06-01');
  });
});
