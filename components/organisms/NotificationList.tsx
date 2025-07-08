import React, { memo } from 'react';

import { FlatList } from 'react-native';

import { Label } from '@/components/atoms';
import { NotificationListItem } from '@/components/molecules';
import { FlatData } from '@/domains';
import { formatDate } from '@/utils/date';
import { Notification } from '@/utils/notification';

interface NotificationListProps {
  onPress: () => void;
  notifications: FlatData<Notification>[];
}

const NotificationList: React.FC<NotificationListProps> = memo(
  function NotificationList({ onPress, notifications }) {
    return (
      <FlatList
        data={notifications}
        keyExtractor={(item) => {
          if (item.type === 'date') return `date-${item.date}`;
          return `group-${item.group.id}`;
        }}
        contentContainerClassName="gap-5 mx-6 pb-5"
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
