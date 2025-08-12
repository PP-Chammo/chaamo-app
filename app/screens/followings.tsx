import { useMemo } from 'react';

import { router, useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';

import { ScreenContainer } from '@/components/atoms';
import { EmptyState, Header } from '@/components/molecules';
import { FollowList } from '@/components/organisms';
import { useGetFollowsQuery } from '@/generated/graphql';
import { useFollows } from '@/hooks/useFollows';
import { useUserVar } from '@/hooks/useUserVar';

export default function FollowingsScreen() {
  const [user] = useUserVar();
  const { userId } = useLocalSearchParams();
  const { followings, getIsFollowing } = useFollows(userId as string);

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
    return (
      data?.followsCollection?.edges.filter((edge) =>
        getIsFollowing(edge.node?.followee_user_id),
      ) ?? []
    );
  }, [data?.followsCollection?.edges, getIsFollowing]);

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
