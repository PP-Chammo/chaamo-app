import { memo, useCallback } from 'react';

import { router } from 'expo-router';
import { TouchableOpacity, View } from 'react-native';

import { Icon, Label } from '@/components/atoms';
import { People } from '@/components/molecules';
import { useUserVar } from '@/hooks/useUserVar';
import { getColor } from '@/utils/getColor';

type ListedByListProps = {
  listingId: string;
  userId: string;
  imageUrl: string;
  username: string;
};

const ListedByList = memo(function ListedByList({
  listingId,
  userId,
  imageUrl,
  username,
}: ListedByListProps) {
  const [user] = useUserVar();

  const handleViewProfilePress = useCallback(() => {
    router.push({
      pathname: '/screens/profile',
      params: {
        userId,
      },
    });
  }, [userId]);

  const handleChatPress = useCallback(() => {
    router.push({
      pathname: '/screens/chat',
      params: {
        userId,
        ...(user?.id !== userId ? { listingId } : {}),
      },
    });
  }, [listingId, userId, user?.id]);

  return (
    <View className={classes.listedByContainer}>
      <View className={classes.listedByWrapper}>
        <Label variant="subtitle">Listed By</Label>
        <People
          imageUrl={imageUrl}
          fullname={username}
          onViewProfilePress={handleViewProfilePress}
          size="md"
        />
      </View>
      {user?.id !== userId && (
        <View className={classes.chatWrapper}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleChatPress}
            className={classes.chat}
          >
            <Icon
              name="chatbubble-ellipses-outline"
              variant="Ionicons"
              size={32}
              color={getColor('gray-600')}
            />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
});

export default ListedByList;

const classes = {
  listedByContainer: 'flex-row justify-between items-end gap-2 px-4.5',
  listedByWrapper: 'gap-2',
  chatWrapper: 'gap-2',
  chat: 'p-4',
  chatText: 'text-center',
};
