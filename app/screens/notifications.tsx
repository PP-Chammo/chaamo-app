import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { router } from 'expo-router';
import { Alert, TouchableOpacity, View } from 'react-native';

import {
  BottomSheetModal,
  Divider,
  Icon,
  Label,
  ScreenContainer,
} from '@/components/atoms';
import { Header } from '@/components/molecules';
import { NotificationList } from '@/components/organisms';
import { dummyNotifications } from '@/constants/dummy';
import { FlatData } from '@/domains';
import { getColor } from '@/utils/getColor';
import { groupNotificationsByDate, Notification } from '@/utils/notification';

export default function Notifications() {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [data, setData] = useState<FlatData<Notification>[]>([]);

  const handlePress = useCallback(() => {
    console.log('PRESSED NOTIFICATION');
  }, []);

  const handleLongPress = useCallback(() => {
    console.log('LONG PRESSED NOTIFICATION');

    setShowModal(true);
  }, []);

  const handleDelete = useCallback(() => {
    console.log('DELETE NOTIFICATION');

    Alert.alert(
      'Delete Notification',
      'Are you sure you want to delete this notification?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'default',
          onPress: () => {
            Alert.alert('Deleted', 'Notification deleted successfully');
            setShowModal(false);
          },
        },
      ],
    );
  }, []);

  useEffect(() => {
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

    setData(flatData);
  }, []);

  const _renderContent = useMemo(() => {
    if (data.length)
      return (
        <NotificationList
          onLongPress={handleLongPress}
          onPress={handlePress}
          notifications={data}
        />
      );
    return (
      <View className={classes.container}>
        <Icon name="bell-off" size={65} color={getColor('gray-300')} />
        <Label className={classes.emptyNotificationText}>
          No notifications yet
        </Label>
      </View>
    );
  }, [data, handleLongPress, handlePress]);

  return (
    <ScreenContainer>
      <Header title="Notifications" onBackPress={() => router.back()} />
      {_renderContent}
      <BottomSheetModal
        show={showModal}
        onDismiss={() => setShowModal(false)}
        height={200}
        variant="secondary"
      >
        <View className={classes.sheetContent}>
          <TouchableOpacity className="bg-white" onPress={handleDelete}>
            <Label className="text-red-500 py-2 px-4">Delete</Label>
          </TouchableOpacity>
          <Divider position="horizontal" />
        </View>
      </BottomSheetModal>
    </ScreenContainer>
  );
}

const classes = {
  container: 'flex-1 items-center mt-24',
  emptyNotificationText: '!text-lg mt-5 text-slate-400',
  bottomSheet: 'bg-primary-500',
  sheetContent: 'mb-24',
};
