import React, { memo } from 'react';

import { View } from 'react-native';

import { Skeleton } from '@/components/atoms';

const UserSkeletonList = memo(function UserSkeletonList() {
  return (
    <Skeleton>
      <View className={classes.container}>
        {[...Array(4).keys()].map((item) => (
          <View key={item} className={classes.containerItem}>
            <View className={classes.avatar} />
            <View className={classes.content} />
          </View>
        ))}
      </View>
    </Skeleton>
  );
});

export default UserSkeletonList;

const classes = {
  container: 'gap-6',
  containerItem: 'flex flex-row gap-3',
  avatar: 'w-14 h-14 bg-slate-600 rounded-full',
  content: 'flex-1 h-14 bg-slate-600 rounded',
};
