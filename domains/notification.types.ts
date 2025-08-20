import { GetUserNotificationSettingsQuery } from '@/generated/graphql';
import { DeepGet } from '@/types/helper';

export type BaseNotificationSetting = DeepGet<
  GetUserNotificationSettingsQuery,
  ['user_notification_settingsCollection', 'edges', number, 'node']
>;

// Minimal shape for a notification type option (replaces legacy notification_types table)
export interface BaseNotificationType {
  id: string;
  name: string;
}

export interface BaseNotification {
  id: string | number;
  content: string;
  created_at: string;
  // Preferred enum field on notifications
  type?: string | null;
}

export interface NotificationType extends BaseNotificationType {
  value: boolean;
  hasNotificationSettingServer: boolean;
}

// Flat list data structure for rendering grouped notifications with date separators
export type FlatData<T> =
  | { type: 'date'; date: string }
  | { type: 'group'; group: T; date: string };
