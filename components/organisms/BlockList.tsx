import React, { memo } from 'react';

import { FlatList } from 'react-native';

import { BlockListItem } from '@/components/molecules';
import { BaseAccount } from '@/domains';

interface BlockListProps {
  data: BaseAccount[];
  isBlocked?: boolean;
}

const BlockList: React.FC<BlockListProps> = memo(function BlockList({
  data,
  isBlocked = false,
}) {
  return (
    <FlatList
      testID="block-list"
      data={data}
      keyExtractor={(item) => item.id.toString()}
      contentContainerClassName={classes.contentContainer}
      renderItem={({ item }) => (
        <BlockListItem
          name={item.name}
          imageUrl={item.imageUrl}
          isBlocked={isBlocked}
          onPress={() => {}}
        />
      )}
    />
  );
});

const classes = {
  contentContainer: 'gap-6',
};

export default BlockList;
