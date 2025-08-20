import { BaseNotification } from '@/domains';
import { NotificationType } from '@/generated/graphql';

// Converts strings like "new_bid" or "auction_won" to "New Bid" / "Auction Won"
const toTitle = (s: string) =>
  s
    .replace(/_/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (m) => m.toUpperCase());

/**
 * Returns a user-friendly category name for a notification.
 * Prefers the enum field `type` on notifications.
 */
type CompatNotification = BaseNotification & {
  type?: NotificationType | string | null;
};

export function getNotificationCategory(n: CompatNotification): string {
  const enumType = n.type as string | null | undefined;
  if (enumType) return toTitle(enumType);
  return 'Unknown';
}
