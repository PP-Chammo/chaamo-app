import React, { memo, useCallback, useMemo } from 'react';

import { router, useLocalSearchParams } from 'expo-router';
import { Alert, FlatList } from 'react-native';

import { Loading } from '@/components/atoms';
import { FollowListItem } from '@/components/molecules';
import {
  GetFollowsQuery,
  useCreateBlockedUsersMutation,
  useCreateFollowsMutation,
  useRemoveBlockedUsersMutation,
  useRemoveFollowsMutation,
} from '@/generated/graphql';
import { useBlockedUsers } from '@/hooks/useBlockedUsers';
import { useFollows } from '@/hooks/useFollows';
import { useUserVar } from '@/hooks/useUserVar';
import { DeepGet } from '@/types/helper';

interface FollowListProps {
  keyData: 'followee_user' | 'follower_user';
  list: DeepGet<GetFollowsQuery, ['followsCollection', 'edges']>;
  loading?: boolean;
}

const FollowList: React.FC<FollowListProps> = memo(function FollowList({
  keyData = 'follower_user',
  list,
  loading,
}) {
  const [user] = useUserVar();
  const { userId } = useLocalSearchParams();
  const { getIsFollowing } = useFollows();
  const { getIsBlocked } = useBlockedUsers();

  const [removeFollow, { loading: removeFollowLoading }] =
    useRemoveFollowsMutation();
  const [createFollow] = useCreateFollowsMutation();
  const [createBlockedUsers] = useCreateBlockedUsersMutation();
  const [removeBlockedUsers] = useRemoveBlockedUsersMutation();

  const isSelf = useMemo(() => {
    if (!userId) return true;
    return user?.id === userId;
  }, [user?.id, userId]);

  const followerUserId = useMemo(() => userId ?? user?.id, [userId, user?.id]);

  const handleToggleFollow = useCallback(
    (followeeUserId: string) => () => {
      if (getIsFollowing(followeeUserId)) {
        removeFollow({
          variables: {
            filter: {
              follower_user_id: { eq: followerUserId },
              followee_user_id: { eq: followeeUserId },
            },
          },
        });
      } else {
        createFollow({
          variables: {
            objects: [
              {
                follower_user_id: followerUserId,
                followee_user_id: followeeUserId,
              },
            ],
          },
        });
      }
    },
    [getIsFollowing, createFollow, removeFollow, followerUserId],
  );

  const handleToggleBlock = useCallback(
    (followeeUserId: string) => () => {
      if (getIsBlocked(followeeUserId)) {
        removeBlockedUsers({
          variables: {
            filter: {
              blocker_user_id: { eq: followerUserId },
              blocked_user_id: { eq: followeeUserId },
            },
          },
          onCompleted: ({ deleteFromblocked_usersCollection }) => {
            if (deleteFromblocked_usersCollection?.records?.length) {
              Alert.alert('Unblocked', 'User unblocked successfully');
            }
          },
        });
      } else {
        createBlockedUsers({
          variables: {
            objects: [
              {
                blocker_user_id: followerUserId,
                blocked_user_id: followeeUserId,
              },
            ],
          },
          onCompleted: ({ insertIntoblocked_usersCollection }) => {
            if (insertIntoblocked_usersCollection?.records?.length) {
              if (keyData === 'followee_user') {
                removeFollow({
                  variables: {
                    filter: {
                      follower_user_id: { eq: user?.id },
                      followee_user_id: { eq: followeeUserId },
                    },
                  },
                });
              }
              Alert.alert('Blocked', 'User blocked successfully');
            }
          },
        });
      }
    },
    [
      getIsBlocked,
      removeBlockedUsers,
      followerUserId,
      createBlockedUsers,
      removeFollow,
      user?.id,
      keyData,
    ],
  );

  if (loading) {
    return <Loading />;
  }

  return (
    <FlatList
      data={list}
      keyExtractor={(item, index) => {
        const user = item.node?.[keyData];
        return String(user?.id) ?? String(index);
      }}
      contentContainerClassName={classes.contentContainer}
      renderItem={({ item }) => {
        const singleUser = item.node?.[keyData];
        if (!singleUser) return null;
        return (
          <FollowListItem
            userId={singleUser.id}
            username={singleUser.username}
            imageUrl={singleUser.profile_image_url ?? ''}
            onPress={() =>
              router.push({
                pathname: '/screens/profile',
                params: {
                  ...(isSelf ? { userId: singleUser.id } : {}),
                },
              })
            }
            onToggleBlockPress={
              isSelf ? handleToggleBlock(singleUser.id) : undefined
            }
            onToggleFollowPress={
              isSelf ? handleToggleFollow(singleUser.id) : undefined
            }
            isLoading={removeFollowLoading}
            isFollowing={getIsFollowing(singleUser.id)}
          />
        );
      }}
    />
  );
});

const classes = {
  contentContainer: 'gap-5',
};

export default FollowList;
