import { router } from 'expo-router';
import { View } from 'react-native';

import { ScreenContainer } from '@/components/atoms';
import { Header } from '@/components/molecules';
import { FollowList } from '@/components/organisms';

export default function FollowersScreen() {
  return (
    <ScreenContainer>
      <Header title="Followers" onBackPress={() => router.back()} />
      <View className={classes.container}>
        <FollowList />
      </View>
    </ScreenContainer>
  );
}

const classes = {
  container: 'px-4.5',
};
