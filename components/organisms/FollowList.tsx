import React, { memo, useCallback, useMemo, useState } from 'react';

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

  const [processed, setProcessed] = useState<string[]>([]);

  const [removeFollow, { loading: removeFollowLoading }] =
    useRemoveFollowsMutation();
  const [createFollow, { loading: createFollowLoading }] =
    useCreateFollowsMutation();
  const [createBlockedUsers] = useCreateBlockedUsersMutation();
  const [removeBlockedUsers] = useRemoveBlockedUsersMutation();

  const isSelfProfile = useMemo(() => {
    if (!userId) {
      return true;
    }
    return user?.id === userId;
  }, [user?.id, userId]);

  const currentUserId = useMemo(() => userId ?? user?.id, [userId, user?.id]);

  const handleToggleFollow = useCallback(
    (followeeUserId: string) => () => {
      setProcessed((prev) => [...prev, followeeUserId]);
      if (getIsFollowing(followeeUserId)) {
        removeFollow({
          variables: {
            filter: {
              follower_user_id: { eq: user?.id },
              followee_user_id: { eq: followeeUserId },
            },
          },
          onCompleted: ({ deleteFromfollowsCollection }) => {
            if (deleteFromfollowsCollection?.records?.length) {
              setProcessed((prev) =>
                prev.filter((id) => id !== followeeUserId),
              );
            }
          },
        });
      } else {
        createFollow({
          variables: {
            objects: [
              {
                follower_user_id: user?.id,
                followee_user_id: followeeUserId,
              },
            ],
          },
          onCompleted: ({ insertIntofollowsCollection }) => {
            if (insertIntofollowsCollection?.records?.length) {
              setProcessed((prev) =>
                prev.filter((id) => id !== followeeUserId),
              );
            }
          },
        });
      }
    },
    [getIsFollowing, removeFollow, user?.id, createFollow],
  );

  const handleToggleBlock = useCallback(
    (followeeUserId: string) => () => {
      if (getIsBlocked(followeeUserId)) {
        removeBlockedUsers({
          variables: {
            filter: {
              blocker_user_id: { eq: currentUserId },
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
                blocker_user_id: currentUserId,
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
      currentUserId,
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
            onPress={() => {
              router.push({
                pathname:
                  user?.id === singleUser.id
                    ? '/(tabs)/profile'
                    : '/screens/profile',
                params: {
                  userId: singleUser.id,
                },
              });
            }}
            onToggleBlockPress={
              isSelfProfile ? handleToggleBlock(singleUser.id) : undefined
            }
            onToggleFollowPress={
              singleUser.id !== user?.id
                ? handleToggleFollow(singleUser.id)
                : undefined
            }
            isLoading={
              processed.includes(singleUser.id) &&
              (removeFollowLoading || createFollowLoading)
            }
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
