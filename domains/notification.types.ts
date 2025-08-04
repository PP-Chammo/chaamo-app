import { GetNotificationTypesQuery } from '@/generated/graphql';
import { DeepGet } from '@/types/helper';

export interface NotificationSetting
  extends DeepGet<
    GetNotificationTypesQuery,
    ['notification_typesCollection', 'edges', 0, 'node']
  > {
  value: boolean;
  hasNotificationSettingServer: boolean;
}
