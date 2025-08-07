import React, { memo } from 'react';

import { FlatList } from 'react-native';

import { FollowListItem } from '@/components/molecules';
import { GetFollowsQuery } from '@/generated/graphql';
import { DeepGet } from '@/types/helper';

type FollowKeyData = 'follower_user' | 'followee_user';

interface FollowListProps {
  data: DeepGet<GetFollowsQuery, ['followsCollection', 'edges']>;
  keyData: FollowKeyData;
  onBlockPress: (userId: string) => void;
  onUnfollowPress?: (user: string) => void;
  isFollowing?: boolean;
}

const FollowList = memo(function FollowList({
  data,
  onBlockPress,
  keyData,
  isFollowing,
  onUnfollowPress,
}: FollowListProps) {
  return (
    <FlatList
      data={data}
      keyExtractor={(item) => {
        const user = item.node[keyData];
        return user?.id?.toString() ?? '';
      }}
      contentContainerClassName={classes.contentContainer}
      renderItem={({ item }) => {
        const user = item.node[keyData];
        if (!user) return null;

        return (
          <FollowListItem
            name={user.username}
            imageUrl={user.profile_image_url ?? ''}
            onBlockPress={() => onBlockPress(user.id)}
            onUnfollowPress={() => onUnfollowPress?.(user.id)}
            isFollowing={isFollowing}
          />
        );
      }}
    />
  );
});

const classes = {
  contentContainer: 'gap-6',
};

export default FollowList;
