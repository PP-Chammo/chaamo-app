import { memo, useCallback } from 'react';

import { router } from 'expo-router';
import { View } from 'react-native';

import { Label } from '@/components/atoms';
import { People } from '@/components/molecules';

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
  const handleViewProfilePress = useCallback(() => {
    router.push({
      pathname: '/screens/profile',
      params: {
        userId,
      },
    });
  }, [userId]);

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
