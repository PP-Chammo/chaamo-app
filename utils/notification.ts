import { format } from 'date-fns';

import { BaseNotification, SendNotificationPayload } from '@/domains';

import { supabase } from './supabase';

export interface DateGroupedNotifications {
  date: string;
  notifications: BaseNotification[];
}

export const groupNotificationsByDate = (
  notifications: BaseNotification[],
): DateGroupedNotifications[] => {
  if (!notifications.length) return [];

  const dateMap: Record<string, BaseNotification[]> = {};

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

export const sendNotification = async (
  payload: SendNotificationPayload,
): Promise<unknown> => {
  try {
    const res = await supabase.functions.invoke('send-notification', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    if (res.error) {
      throw res.error;
    }

    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
