import { memo } from 'react';

import { View } from 'react-native';

import { Label } from '@/components/atoms';
import { People } from '@/components/molecules';

const ListedByList = memo(function ListedByList() {
  return (
    <View className={classes.listedByWrapper}>
      <Label variant="subtitle">Listed By</Label>
      <People fullname="John Doe" onViewProfilePress={() => {}} />
    </View>
  );
});

export default ListedByList;

const classes = {
  listedByWrapper: 'px-4.5 gap-2',
};
