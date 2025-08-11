import React, { memo, useCallback, useState } from 'react';

import { router } from 'expo-router';
import { FlatList } from 'react-native';

import { Loading } from '@/components/atoms';
import { BlockListItem } from '@/components/molecules';
import {
  GetProfilesQuery,
  useCreateBlockedUsersMutation,
  useRemoveBlockedUsersMutation,
  useRemoveFollowsMutation,
} from '@/generated/graphql';
import { useBlockedUsers } from '@/hooks/useBlockedUsers';
import { useFollows } from '@/hooks/useFollows';
import { useUserVar } from '@/hooks/useUserVar';
import { DeepGet } from '@/types/helper';

interface BlockListProps {
  list: DeepGet<GetProfilesQuery, ['profilesCollection', 'edges']>;
  loading?: boolean;
}

const BlockList: React.FC<BlockListProps> = memo(function BlockList({
  list,
  loading,
}) {
  const [user] = useUserVar();
  const { getIsFollowing } = useFollows();
  const { getIsBlocked } = useBlockedUsers();

  const [processedList, setProcessedList] = useState<string[]>([]);

  const [removeFollow] = useRemoveFollowsMutation();
  const [createBlockedUsers, { loading: createBlockedUsersLoading }] =
    useCreateBlockedUsersMutation();
  const [removeBlockedUsers, { loading: removeBlockedUsersLoading }] =
    useRemoveBlockedUsersMutation();

  const handleToggleBlock = useCallback(
    (followeeUserId: string) => () => {
      setProcessedList((prev) => [...prev, followeeUserId]);
      if (getIsBlocked(followeeUserId)) {
        removeBlockedUsers({
          variables: {
            filter: {
              blocker_user_id: { eq: user?.id },
              blocked_user_id: { eq: followeeUserId },
            },
          },
          onCompleted: () => {
            setProcessedList((prev) =>
              prev.filter((id) => id !== followeeUserId),
            );
          },
        });
      } else {
        createBlockedUsers({
          variables: {
            objects: [
              {
                blocker_user_id: user?.id,
                blocked_user_id: followeeUserId,
              },
            ],
          },
          onCompleted: ({ insertIntoblocked_usersCollection }) => {
            if (
              insertIntoblocked_usersCollection?.records?.length &&
              getIsFollowing(user?.id)
            ) {
              removeFollow({
                variables: {
                  filter: {
                    follower_user_id: { eq: user?.id },
                    followee_user_id: { eq: followeeUserId },
                  },
                },
              });
            }
            setProcessedList((prev) =>
              prev.filter((id) => id !== followeeUserId),
            );
          },
        });
      }
    },
    [
      getIsBlocked,
      getIsFollowing,
      createBlockedUsers,
      removeBlockedUsers,
      removeFollow,
      user?.id,
    ],
  );

  if (loading) {
    return <Loading />;
  }

  return (
    <FlatList
      testID="block-list"
      data={list}
      keyExtractor={(item) => String(item.node?.id)}
      contentContainerClassName={classes.contentContainer}
      renderItem={({ item }) => {
        const profile = item.node;
        return (
          <BlockListItem
            username={profile?.username ?? ''}
            imageUrl={profile?.profile_image_url ?? ''}
            onPress={() =>
              router.push({
                pathname: '/screens/profile',
                params: {
                  userId: profile?.id,
                },
              })
            }
            onToggleBlockPress={handleToggleBlock(profile?.id)}
            isBlocked={getIsBlocked(profile?.id)}
            isLoading={
              processedList.includes(profile?.id) &&
              (createBlockedUsersLoading || removeBlockedUsersLoading)
            }
          />
        );
      }}
    />
  );
});

const classes = {
  contentContainer: 'gap-5',
};

export default BlockList;
