import React, { memo } from 'react';

import { clsx } from 'clsx';
import { Pressable, View } from 'react-native';

import { Avatar, Label } from '@/components/atoms';
import { formatTime } from '@/utils/date';

interface ChatListItemProps {
  name: string;
  message: string;
  time: string;
  unreadCount: number;
  imageUrl: string;
  onPress: () => void;
  onLongPress: () => void;
}

const ChatListItem: React.FC<ChatListItemProps> = memo(function ChatListItem({
  name,
  message,
  time,
  unreadCount,
  imageUrl,
  onPress,
  onLongPress,
}) {
  const containerClassName = unreadCount && classes.container.unread;
  const timeCustom = formatTime(time);

  return (
    <Pressable
      testID="chat-list-item"
      onPress={onPress}
      onLongPress={onLongPress}
      className={clsx(classes.container.base, containerClassName)}
    >
      <View className={classes.leftContainer}>
        <View className={classes.avatarContainer}>
          <Avatar size="sm" imageUrl={imageUrl} />
          <View className={classes.statusIndicator} />
        </View>
        <View className={classes.chatInfoContainer}>
          <Label className={classes.name}>{name}</Label>
          <Label className={classes.message}>{message}</Label>
        </View>
      </View>

      <View className={classes.rightContainer}>
        <Label className={classes.time}>{timeCustom}</Label>
        {!!unreadCount && (
          <View className={classes.unreadCountContainer}>
            <Label className={classes.unreadCount}>{unreadCount}</Label>
          </View>
        )}
      </View>
    </Pressable>
  );
});

const classes = {
  container: {
    base: 'flex-row justify-between px-5 py-3',
    unread: 'bg-primary-100/50',
  },
  leftContainer: 'flex-row items-center gap-5',
  avatarContainer: 'relative',
  rightContainer: 'items-end gap-1',
  statusIndicator:
    'h-3 w-3 bg-green-500 rounded-full absolute bottom-1.5 right-0 border border-white',
  chatInfoContainer: 'gap-1',
  name: 'text-slate-800 font-semibold',
  message: 'text-slate-500',
  time: 'text-slate-500',
  unreadCountContainer:
    'bg-primary-500 rounded-full w-6 h-6 items-center justify-center',
  unreadCount: 'text-white text-sm',
};

export default ChatListItem;
