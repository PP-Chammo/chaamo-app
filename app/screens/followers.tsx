import { useCallback, useMemo } from 'react';

import { router, useFocusEffect } from 'expo-router';
import { Alert, View } from 'react-native';

import { ScreenContainer } from '@/components/atoms';
import { EmptyState, Header } from '@/components/molecules';
import { FollowList } from '@/components/organisms';
import {
  useCreateBlockedUsersMutation,
  useGetFollowsQuery,
  useRemoveFollowsMutation,
} from '@/generated/graphql';
import { useUserVar } from '@/hooks/useUserVar';

export default function FollowersScreen() {
  const [user] = useUserVar();

  const { data, refetch } = useGetFollowsQuery({
    variables: {
      filter: {
        followee_user_id: { eq: user?.id },
      },
    },
  });

  const [addBlockedUsers] = useCreateBlockedUsersMutation();
  const [removeFollowers] = useRemoveFollowsMutation();

  const handleUnfollow = useCallback(
    (userId: string) => {
      removeFollowers({
        variables: {
          filter: {
            followee_user_id: { eq: user?.id },
            follower_user_id: { eq: userId },
          },
        },
        onCompleted: ({ deleteFromfollowsCollection }) => {
          if (deleteFromfollowsCollection?.records?.length) {
            refetch();
          }
        },
      });
    },
    [refetch, removeFollowers, user?.id],
  );

  const handleBlock = useCallback(
    (userId: string) => {
      addBlockedUsers({
        variables: {
          objects: [
            {
              blocker_user_id: user?.id,
              blocked_user_id: userId,
            },
          ],
        },
        onCompleted: ({ insertIntoblocked_usersCollection }) => {
          if (insertIntoblocked_usersCollection?.records?.length) {
            handleUnfollow(userId);
            Alert.alert('Blocked', 'User blocked successfully');
          }
        },
      });
    },
    [addBlockedUsers, user?.id, handleUnfollow],
  );

  const followers = useMemo(() => {
    return data?.followsCollection?.edges ?? [];
  }, [data?.followsCollection?.edges]);

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );

  const _renderContent = useMemo(() => {
    if (followers.length) {
      return (
        <View className={classes.container}>
          <FollowList
            keyData="follower_user"
            data={followers}
            onBlockPress={handleBlock}
          />
        </View>
      );
    }

    return (
      <EmptyState
        iconName="user-follow"
        message="No followers yet"
        iconVariant="SimpleLineIcons"
      />
    );
  }, [followers, handleBlock]);

  return (
    <ScreenContainer>
      <Header title="Followers" onBackPress={() => router.back()} />
      {_renderContent}
    </ScreenContainer>
  );
}

const classes = {
  container: 'px-4.5',
};
