import { useCallback, useMemo, useState } from 'react';

import { router } from 'expo-router';
import { ScrollView } from 'react-native';

import { ScreenContainer } from '@/components/atoms';
import { Header, SwitchInput } from '@/components/molecules';
import { NotificationSetting } from '@/domains/notification.types';
import {
  NotificationType as ListNotificationType,
  useCreateUserNotificationSettingsMutation,
  useGetUserNotificationSettingsQuery,
  useUpdateUserNotificationSettingsMutation,
} from '@/generated/graphql';
import { getUserNotificationSettings } from '@/graphql/user_notification_settings';
import { useUserVar } from '@/hooks/useUserVar';
import { titleCase } from '@/utils/char';

export default function SettingsScreen() {
  const [user] = useUserVar();
  const [localNotificationSettings, setLocalNotificationSettings] = useState<
    Record<string, boolean>
  >({});

  const { data: userNotificationSettingsData } =
    useGetUserNotificationSettingsQuery({
      fetchPolicy: 'cache-and-network',
      variables: {
        filter: {
          user_id: {
            eq: user.id,
          },
        },
      },
    });

  const [updateNotificationSetting, { loading: isUpdating }] =
    useUpdateUserNotificationSettingsMutation();
  const [createNotificationSetting, { loading: isCreating }] =
    useCreateUserNotificationSettingsMutation();

  const notificationTypes = useMemo(() => {
    const notificationTypes = Object.values(ListNotificationType);

    const userNotificationSettings =
      userNotificationSettingsData?.user_notification_settingsCollection
        ?.edges ?? [];

    return notificationTypes?.map((type) => {
      const currentUserNotification = userNotificationSettings?.find(
        (item) => item.node.notification_type === type,
      );
      const serverValue = currentUserNotification?.node.is_enabled || false;
      const localValue = localNotificationSettings[type];

      return {
        id: type,
        notification_type: titleCase(type),
        hasNotificationSettingServer: !!currentUserNotification,
        value: localValue ?? serverValue,
      };
    });
  }, [
    localNotificationSettings,
    userNotificationSettingsData?.user_notification_settingsCollection?.edges,
  ]);

  const handleToggleNotification = useCallback(
    (notification: NotificationSetting) => {
      const { id, value, hasNotificationSettingServer } = notification ?? {};

      setLocalNotificationSettings((prev) => ({
        ...prev,
        [id]: !value,
      }));

      if (hasNotificationSettingServer) {
        updateNotificationSetting({
          variables: {
            set: {
              is_enabled: !value,
            },
            filter: {
              notification_type: {
                eq: id,
              },
              user_id: {
                eq: user.id,
              },
            },
          },
          refetchQueries: [
            {
              query: getUserNotificationSettings,
              variables: {
                filter: {
                  user_id: {
                    eq: user.id,
                  },
                },
              },
            },
          ],
          awaitRefetchQueries: true,
          onError: (error) => {
            setLocalNotificationSettings((prev) => ({
              ...prev,
              [id]: value,
            }));
            console.error('Failed to update notification setting:', error);
          },
        });
      } else {
        createNotificationSetting({
          variables: {
            objects: [
              {
                user_id: user.id,
                notification_type: id,
                is_enabled: !value,
              },
            ],
          },
          refetchQueries: [
            {
              query: getUserNotificationSettings,
              variables: {
                filter: {
                  user_id: {
                    eq: user.id,
                  },
                },
              },
            },
          ],
          awaitRefetchQueries: true,
          onError: (error) => {
            setLocalNotificationSettings((prev) => ({
              ...prev,
              [id]: value,
            }));
            console.error('Failed to update notification setting:', error);
          },
        });
      }
    },
    [createNotificationSetting, updateNotificationSetting, user.id],
  );

  return (
    <ScreenContainer classNameTop={classes.containerTop}>
      <Header
        title="Personalize Notification"
        onBackPress={() => router.back()}
        className={classes.header}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName={classes.contentContainer}
      >
        {notificationTypes?.map((item) => (
          <SwitchInput
            key={item.notification_type}
            label={item.notification_type}
            value={item.value}
            onValueChange={() =>
              handleToggleNotification(item as NotificationSetting)
            }
            disabled={isUpdating || isCreating}
          />
        ))}
      </ScrollView>
    </ScreenContainer>
  );
}

const classes = {
  containerTop: 'bg-white',
  contentContainer: 'my-4 gap-2.5',
  header: 'bg-white',
};
