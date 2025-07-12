import React from 'react';

import { Avatar, Button, Label, Row } from '@/components/atoms';

interface BlockListItemProps {
  name: string;
  imageUrl: string;
  isBlocked: boolean;
  onPress: () => void;
}

const BlockListItem: React.FC<BlockListItemProps> = ({
  name,
  imageUrl,
  isBlocked,
  onPress,
}) => {
  return (
    <Row testID="block-list-item" between>
      <Row className={classes.row}>
        <Avatar testID="avatar" imageUrl={imageUrl} size={50} />
        <Label>{name}</Label>
      </Row>
      <Row className={classes.row}>
        <Button onPress={onPress}>{isBlocked ? 'Unblock' : 'Block'}</Button>
      </Row>
    </Row>
  );
};

const classes = {
  row: 'gap-3',
  blockMenu: 'flex-row items-center py-2 px-3 gap-2',
  blockText: '!text-red-600 text-sm',
};

export default BlockListItem;
