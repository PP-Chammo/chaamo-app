import React, { memo } from 'react';

import { FlatList } from 'react-native';

import { FollowListItem } from '@/components/molecules';
import { dummyFollowingList } from '@/constants/dummy';

const FollowList = memo(function FollowList() {
  return (
    <FlatList
      data={dummyFollowingList}
      keyExtractor={(item) => item.id.toString()}
      contentContainerClassName={classes.contentContainer}
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

const classes = {
  contentContainer: 'gap-6',
};

export default FollowList;
