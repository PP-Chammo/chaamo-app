import React, { useCallback } from 'react';

import { router } from 'expo-router';

import { ScreenContainer } from '@/components/atoms';
import { Header } from '@/components/molecules';
import NotificationList from '@/components/organisms/NotificationList';
import { dummyNotifications } from '@/constants/dummy';
import { FlatData } from '@/domains';
import { groupNotificationsByDate, Notification } from '@/utils/notification';

export default function Notifications() {
  const handlePress = useCallback(() => {
    console.log('PRESSED NOTIFICATION');
  }, []);

  const groupedNotifications = groupNotificationsByDate(
    dummyNotifications as Notification[],
  );

  const flatData: FlatData<Notification>[] = [];
  groupedNotifications.forEach((dateGroup) => {
    flatData.push({ type: 'date', date: dateGroup.date });
    dateGroup.notifications.forEach((group) => {
      flatData.push({ type: 'group', group, date: dateGroup.date });
    });
  });

  return (
    <ScreenContainer>
      <Header title="Notifications" onBackPress={() => router.back()} />
      <NotificationList onPress={handlePress} notifications={flatData} />
    </ScreenContainer>
  );
}
