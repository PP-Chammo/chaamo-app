import { useCallback, useMemo, useState } from 'react';

import { router } from 'expo-router';
import { ScrollView } from 'react-native';

import { ScreenContainer } from '@/components/atoms';
import { Header, SwitchInput } from '@/components/molecules';
import { NotificationType } from '@/domains/notification.types';
import {
  useCreateUserNotificationSettingsMutation,
  useGetNotificationTypesQuery,
  useGetUserNotificationSettingsQuery,
  useUpdateUserNotificationSettingsMutation,
} from '@/generated/graphql';
import { useUserVar } from '@/hooks/useUserVar';

export default function SettingsScreen() {
  const [user] = useUserVar();
  const [localNotificationSettings, setLocalNotificationSettings] = useState<
    Record<string, boolean>
  >({});

  const { data: notificationTypesData } = useGetNotificationTypesQuery({
    fetchPolicy: 'cache-and-network',
  });

  const { data: userNotificationSettingsData } =
    useGetUserNotificationSettingsQuery({
      variables: {
        filter: {
          user_id: {
            eq: user.id,
          },
        },
      },
    });

  const [updateNotificationSetting] =
    useUpdateUserNotificationSettingsMutation();
  const [createNotificationSetting] =
    useCreateUserNotificationSettingsMutation();

  const notificationTypes = useMemo(() => {
    const userNotificationSettings =
      userNotificationSettingsData?.user_notification_settingsCollection
        ?.edges ?? [];

    return notificationTypesData?.notification_typesCollection?.edges?.map(
      (edge) => {
        const currentUserNotification = userNotificationSettings?.find(
          (item) => item.node.notification_type_id === edge.node.id,
        );
        const serverValue = currentUserNotification?.node.is_enabled || false;
        const localValue = localNotificationSettings[edge.node.id];

        return {
          ...edge?.node,
          hasNotificationSettingServer: !!currentUserNotification,
          value: localValue ?? serverValue,
        };
      },
    );
  }, [
    notificationTypesData?.notification_typesCollection?.edges,
    userNotificationSettingsData?.user_notification_settingsCollection?.edges,
    localNotificationSettings,
  ]);

  const handleToggleNotification = useCallback(
    (notification: NotificationType) => {
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
              notification_type_id: {
                eq: id,
              },
              user_id: {
                eq: user.id,
              },
            },
          },
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
                notification_type_id: id,
                is_enabled: !value,
              },
            ],
          },
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
            key={item.id}
            label={item.name}
            value={item.value}
            onValueChange={() => handleToggleNotification(item)}
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
