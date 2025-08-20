import { BaseNotification } from '@/domains';
import { NotificationType } from '@/generated/graphql';

import { titleCase } from './char';

/**
 * Returns a user-friendly category name for a notification.
 * Prefers the enum field `type` on notifications.
 */
type CompatNotification = BaseNotification & {
  type?: NotificationType | string | null;
};

export function getNotificationCategory(n: CompatNotification): string {
  const enumType = n.type as string | null | undefined;
  if (enumType) return titleCase(enumType);
  return 'Unknown';
}
