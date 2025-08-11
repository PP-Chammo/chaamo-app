import { useMemo } from 'react';

import { router, useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';

import { ScreenContainer } from '@/components/atoms';
import { EmptyState, Header } from '@/components/molecules';
import { FollowList } from '@/components/organisms';
import { useGetFollowsQuery } from '@/generated/graphql';
import { useFollows } from '@/hooks/useFollows';
import { useRealtime } from '@/hooks/useRealtime';
import { useUserVar } from '@/hooks/useUserVar';

export default function FollowingsScreen() {
  useRealtime(['follows']);
  const [user] = useUserVar();
  const { userId } = useLocalSearchParams();
  const { followings } = useFollows(userId as string);

  const { data, loading } = useGetFollowsQuery({
    skip: !userId && !user?.id,
    fetchPolicy: 'cache-and-network',
    variables: {
      filter: {
        follower_user_id: { eq: userId ?? user?.id },
      },
    },
  });

  const followingUsers = useMemo(() => {
    return data?.followsCollection?.edges ?? [];
  }, [data?.followsCollection?.edges]);

  return (
    <ScreenContainer>
      <Header title="Followings" onBackPress={() => router.back()} />
      {followings.length > 0 || loading ? (
        <View className={classes.container}>
          <FollowList
            list={followingUsers}
            keyData="followee_user"
            loading={loading}
          />
        </View>
      ) : (
        <EmptyState
          iconName="user-follow"
          message="No followings yet"
          iconVariant="SimpleLineIcons"
        />
      )}
    </ScreenContainer>
  );
}

const classes = {
  container: 'flex-1 px-4.5',
};
