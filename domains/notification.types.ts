import { notificationTemplatesMap } from '@/constants/notificationTemplates';
import {
  GetNotificationsQuery,
  GetUserNotificationSettingsQuery,
  NotificationType,
} from '@/generated/graphql';
import { DeepGet } from '@/types/helper';

export type BaseNotificationSetting = DeepGet<
  GetUserNotificationSettingsQuery,
  ['user_notification_settingsCollection', 'edges', number, 'node']
>;

export type BaseNotification = DeepGet<
  GetNotificationsQuery,
  ['notificationsCollection', 'edges', number, 'node']
>;

export interface NotificationSetting {
  id: NotificationType;
  notification_type: string;
  value: boolean;
  hasNotificationSettingServer: boolean;
}

// Flat list data structure for rendering grouped notifications with date separators
export type FlatData<T> =
  | { type: 'date'; date: string }
  | { type: 'group'; group: T; date: string };

export interface SendNotificationPayload {
  user_id: string;
  template_name: string;
  data?: Record<string, unknown>;
}

export interface NotificationActionType {
  label: string;
  type: string;
  action_key: (typeof notificationTemplatesMap)[keyof typeof notificationTemplatesMap];
  payload: Record<string, string>;
}
