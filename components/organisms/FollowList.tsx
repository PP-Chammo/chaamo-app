import React, { memo } from 'react';

import { FlatList } from 'react-native';

import { FollowListItem } from '@/components/molecules';
import { dummyFollowingList } from '@/constants/dummy';

interface FollowListProps {}

const FollowList: React.FC<FollowListProps> = memo(function FollowList() {
  return (
    <FlatList
      data={dummyFollowingList}
      keyExtractor={(item) => item.id.toString()}
      contentContainerClassName="gap-6"
      renderItem={({ item }) => (
        <FollowListItem
          name={item.name}
          imageUrl={item.imageUrl}
          isFollowing={item.isFollowing}
          onPressFollow={() => {}}
        />
      )}
    />
  );
});

export default FollowList;
