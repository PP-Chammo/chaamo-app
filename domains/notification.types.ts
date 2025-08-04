import { GetNotificationsQuery } from '@/generated/graphql';
import { DeepGet } from '@/types/helper';

export type Notification = DeepGet<
  GetNotificationsQuery,
  ['notificationsCollection', 'edges', 0, 'node']
>;
