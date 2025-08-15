import {
  GetNotificationsQuery,
  GetNotificationTypesQuery,
  GetUserNotificationSettingsQuery,
} from '@/generated/graphql';
import { DeepGet } from '@/types/helper';

export type BaseNotificationSetting = DeepGet<
  GetUserNotificationSettingsQuery,
  ['user_notification_settingsCollection', 'edges', number, 'node']
>;

export type BaseNotificationType = DeepGet<
  GetNotificationTypesQuery,
  ['notification_typesCollection', 'edges', number, 'node']
>;

export type BaseNotification = DeepGet<
  GetNotificationsQuery,
  ['notificationsCollection', 'edges', number, 'node']
>;

export interface NotificationType extends BaseNotificationType {
  value: boolean;
  hasNotificationSettingServer: boolean;
}

// Flat list data structure for rendering grouped notifications with date separators
export type FlatData<T> =
  | { type: 'date'; date: string }
  | { type: 'group'; group: T; date: string };
