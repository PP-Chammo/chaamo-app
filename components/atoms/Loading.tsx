import { memo } from 'react';

import { ActivityIndicator, Text, View } from 'react-native';

import { getColor } from '@/utils/getColor';

const Loading = memo(function Loading() {
  return (
    <View className={classes.container}>
      <View className={classes.loadingContainer}>
        <ActivityIndicator color={getColor('primary-500')} />
        <Text className={classes.loadingText}>Loading...</Text>
      </View>
    </View>
  );
});

const classes = {
  container: 'flex-1',
  loadingContainer: 'flex-1 flex-row items-center justify-center gap-2',
  loadingText: 'text-base text-neutral-600 dark:text-neutral-600',
};

export default Loading;
