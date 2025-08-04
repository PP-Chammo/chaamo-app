import { format } from 'date-fns';

import { Notification } from '@/domains';

export interface DateGroupedNotifications {
  date: string;
  notifications: Notification[];
}

export const groupNotificationsByDate = (
  notifications: Notification[],
): DateGroupedNotifications[] => {
  if (!notifications.length) return [];

  const dateMap: Record<string, Notification[]> = {};

  for (const notif of notifications) {
    const dateKey = format(new Date(notif.created_at), 'yyyy-MM-dd');
    if (!dateMap[dateKey]) dateMap[dateKey] = [];
    dateMap[dateKey].push(notif);
  }

  const result: DateGroupedNotifications[] = [];
  for (const date in dateMap) {
    if (!Object.prototype.hasOwnProperty.call(dateMap, date)) continue;
    result.push({ date, notifications: dateMap[date] });
  }

  result.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  return result;
};
