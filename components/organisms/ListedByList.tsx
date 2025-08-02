import { memo } from 'react';

import { Alert, View } from 'react-native';

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
  return (
    <View className={classes.listedByWrapper}>
      <Label variant="subtitle">Listed By</Label>
      <People
        imageUrl={imageUrl}
        fullname={username}
        onViewProfilePress={() => {
          Alert.alert('Coming soon');
        }}
        size="md"
      />
    </View>
  );
});

export default ListedByList;

const classes = {
  listedByWrapper: 'px-4.5 gap-2',
};
