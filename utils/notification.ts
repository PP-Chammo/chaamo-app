import { format } from 'date-fns';

export interface Notification {
  id: number;
  category: 'Order Shipped' | 'New Bid' | 'Bid Ending';
  message: string;
  date: string;
}

export interface DateGroupedNotifications {
  date: string;
  notifications: Notification[];
}

export const groupNotificationsByDate = (
  notifications: Notification[],
): DateGroupedNotifications[] => {
  if (!notifications.length) return [];

  // Group notifications by date
  const dateMap: Record<string, Notification[]> = {};

  for (const notif of notifications) {
    const dateKey = format(new Date(notif.date), 'yyyy-MM-dd');
    if (!dateMap[dateKey]) dateMap[dateKey] = [];
    dateMap[dateKey].push(notif);
  }

  // Build result array
  const result: DateGroupedNotifications[] = [];
  for (const date in dateMap) {
    if (!Object.prototype.hasOwnProperty.call(dateMap, date)) continue;
    result.push({ date, notifications: dateMap[date] });
  }

  // Sort by date descending
  result.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  return result;
};
