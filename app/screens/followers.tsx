import { useMemo } from 'react';

import { router, useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';

import { ScreenContainer } from '@/components/atoms';
import { EmptyState, Header } from '@/components/molecules';
import { FollowList } from '@/components/organisms';
import { useGetFollowsQuery } from '@/generated/graphql';
import { useFollows } from '@/hooks/useFollows';
import { useUserVar } from '@/hooks/useUserVar';

export default function FollowersScreen() {
  const [user] = useUserVar();
  const { userId } = useLocalSearchParams();
  const { followers } = useFollows(userId as string);

  const { data, loading } = useGetFollowsQuery({
    skip: !userId && !user?.id,
    fetchPolicy: 'cache-and-network',
    variables: {
      filter: {
        followee_user_id: { eq: userId ?? user?.id },
      },
    },
  });

  const followerUsers = useMemo(() => {
    return data?.followsCollection?.edges ?? [];
  }, [data?.followsCollection?.edges]);

  return (
    <ScreenContainer>
      <Header title="Followers" onBackPress={() => router.back()} />
      {followers.length > 0 || loading ? (
        <View className={classes.container}>
          <FollowList
            list={followerUsers}
            keyData="follower_user"
            loading={loading}
          />
        </View>
      ) : (
        <EmptyState
          iconName="user-follow"
          message="No followers yet"
          iconVariant="SimpleLineIcons"
        />
      )}
    </ScreenContainer>
  );
}

const classes = {
  container: 'flex-1 px-4.5',
};
