import { router } from 'expo-router';

import { ScreenContainer } from '@/components/atoms';
import { Header } from '@/components/molecules';
import { FollowList } from '@/components/organisms';

export default function FollowersScreen() {
  return (
    <ScreenContainer className="mx-4.5">
      <Header title="Followers" onBackPress={() => router.back()} />
      <FollowList />
    </ScreenContainer>
  );
}
