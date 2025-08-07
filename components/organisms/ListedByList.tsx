import { memo, useCallback } from 'react';

import { router } from 'expo-router';
import { View } from 'react-native';

import { Label } from '@/components/atoms';
import { People } from '@/components/molecules';
import { useUserVar } from '@/hooks/useUserVar';

type ListedByListProps = {
  userId: string;
  imageUrl: string;
  username: string;
};

const ListedByList = memo(function ListedByList({
  userId,
  imageUrl,
  username,
}: ListedByListProps) {
  const [user] = useUserVar();

  const handleViewProfilePress = useCallback(() => {
    if (user.id === userId) {
      router.push('/(tabs)/profile');
    } else {
      router.push(`/screens/public-profile?userId=${userId}`);
    }
  }, [userId, user.id]);

  return (
    <View className={classes.listedByWrapper}>
      <Label variant="subtitle">Listed By</Label>
      <People
        imageUrl={imageUrl}
        fullname={username}
        onViewProfilePress={handleViewProfilePress}
        size="md"
      />
    </View>
  );
});

export default ListedByList;

const classes = {
  listedByWrapper: 'px-4.5 gap-2',
};
