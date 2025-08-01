import React, { memo } from 'react';

import { FlatList } from 'react-native';

import { Label } from '@/components/atoms';
import { NotificationListItem } from '@/components/molecules';
import { FlatData } from '@/domains';
import { formatDate } from '@/utils/date';
import { Notification } from '@/utils/notification';

interface NotificationListProps {
  onPress: () => void;
  onLongPress: () => void;
  notifications: FlatData<Notification>[];
}

const NotificationList: React.FC<NotificationListProps> = memo(
  function NotificationList({ onPress, onLongPress, notifications }) {
    return (
      <FlatList
        testID="notification-list"
        data={notifications}
        keyExtractor={(item) => {
          if (item.type === 'date') return `date-${item.date}`;
          return `group-${item.group.id}`;
        }}
        contentContainerClassName="gap-5 mx-4.5 pb-4.5"
        renderItem={({ item }) => {
          if (item.type === 'date') {
            return (
              <Label className={classes.dateText}>
                {formatDate(item.date)}
              </Label>
            );
          }
          const group = item.group;
          return (
            <NotificationListItem
              category={group.category}
              message={group.message}
              date={group.date}
              onPress={onPress}
              onLongPress={onLongPress}
            />
          );
        }}
      />
    );
  },
);

const classes = {
  dateText: 'text-slate-700 my-2',
};

export default NotificationList;
