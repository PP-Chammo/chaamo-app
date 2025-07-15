import React, { useCallback, useMemo } from 'react';

import { router } from 'expo-router';
import { View } from 'react-native';

import { Icon, Label, ScreenContainer } from '@/components/atoms';
import { Header } from '@/components/molecules';
import { NotificationList } from '@/components/organisms';
import { dummyNotifications } from '@/constants/dummy';
import { FlatData } from '@/domains';
import { getColor } from '@/utils/getColor';
import { groupNotificationsByDate, Notification } from '@/utils/notification';

export default function Notifications() {
  const handlePress = useCallback(() => {
    console.log('PRESSED NOTIFICATION');
  }, []);

  const groupedNotifications = groupNotificationsByDate(
    dummyNotifications as Notification[],
  );

  const flatData: FlatData<Notification>[] = useMemo(() => [], []);

  groupedNotifications.forEach((dateGroup) => {
    flatData.push({ type: 'date', date: dateGroup.date });
    dateGroup.notifications.forEach((group) => {
      flatData.push({ type: 'group', group, date: dateGroup.date });
    });
  });

  const _renderContent = useMemo(() => {
    if (flatData.length)
      return (
        <NotificationList onPress={handlePress} notifications={flatData} />
      );
    return (
      <View className={classes.container}>
        <Icon name="bell-off" size={65} color={getColor('gray-300')} />
        <Label className={classes.emptyNotificationText}>
          No notifications yet
        </Label>
      </View>
    );
  }, [flatData, handlePress]);

  return (
    <ScreenContainer>
      <Header title="Notifications" onBackPress={() => router.back()} />
      {_renderContent}
    </ScreenContainer>
  );
}

const classes = {
  container: 'flex-1 items-center mt-24',
  emptyNotificationText: '!text-lg mt-5 text-slate-400',
};
