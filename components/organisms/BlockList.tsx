import React, { memo, useCallback, useState } from 'react';

import { FlatList } from 'react-native';

import { BlockListItem } from '@/components/molecules';
import { BlockedUsers } from '@/domains';

interface BlockListProps {
  data: BlockedUsers;
  isBlocked?: boolean;
  onRemove?: (id: string) => void;
  onBlock?: (id: string) => void;
  isLoading?: boolean;
}

const BlockList: React.FC<BlockListProps> = memo(function BlockList({
  data,
  isBlocked = false,
  onBlock,
  onRemove,
  isLoading,
}) {
  const [itemIdLoading, setItemIdLoading] = useState('');
  const handlePress = useCallback(
    (id: string) => {
      setItemIdLoading(id);

      if (isBlocked) {
        onRemove?.(id);
      } else {
        onBlock?.(id);
      }
    },
    [isBlocked, onBlock, onRemove],
  );
  return (
    <FlatList
      testID="block-list"
      data={data}
      keyExtractor={(item) => item.id.toString()}
      contentContainerClassName={classes.contentContainer}
      renderItem={({ item }) => (
        <BlockListItem
          {...item}
          isBlocked={isBlocked}
          onPress={handlePress}
          isLoading={itemIdLoading === item.id && isLoading}
        />
      )}
    />
  );
});

const classes = {
  contentContainer: 'gap-6',
};

export default BlockList;
