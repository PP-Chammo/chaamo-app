import { useCallback, useMemo } from 'react';

import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
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

export default function FollowingsScreen() {
  const { publicUserId } = useLocalSearchParams();
  const [user] = useUserVar();

  const { data, refetch } = useGetFollowsQuery({
    variables: {
      filter: {
        follower_user_id: { eq: publicUserId ?? user?.id },
      },
    },
  });

  const [addBlockedUsers] = useCreateBlockedUsersMutation();
  const [removeFollowing] = useRemoveFollowsMutation();

  const handleUnfollow = useCallback(
    (userId: string) => {
      removeFollowing({
        variables: {
          filter: {
            followee_user_id: { eq: userId },
            follower_user_id: { eq: publicUserId ?? user?.id },
          },
        },
        onCompleted: () => {
          refetch();
        },
      });
    },
    [publicUserId, refetch, removeFollowing, user?.id],
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

  const followings = useMemo(() => {
    return data?.followsCollection?.edges ?? [];
  }, [data?.followsCollection?.edges]);

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );

  const _renderContent = useMemo(() => {
    if (followings.length) {
      return (
        <View className={classes.container}>
          <FollowList
            keyData="followee_user"
            data={followings}
            onBlockPress={handleBlock}
            isFollowing
            onUnfollowPress={handleUnfollow}
          />
        </View>
      );
    }

    return (
      <EmptyState
        iconName="user-follow"
        message="No followings yet"
        iconVariant="SimpleLineIcons"
      />
    );
  }, [followings, handleBlock, handleUnfollow]);

  return (
    <ScreenContainer>
      <Header title="Followings" onBackPress={() => router.back()} />
      {_renderContent}
    </ScreenContainer>
  );
}

const classes = {
  container: 'px-4.5',
};
