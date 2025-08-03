import React from 'react';

import { Avatar, Button, Label, Row } from '@/components/atoms';

interface BlockListItemProps {
  id: string;
  username: string;
  profile_image_url: string;
  isLoading: boolean;
  isBlocked: boolean;
  onPress: (id: string) => void;
}

const BlockListItem: React.FC<BlockListItemProps> = ({
  id,
  username,
  profile_image_url,
  isLoading,
  isBlocked,
  onPress,
}) => {
  return (
    <Row testID="block-list-item" between>
      <Row className={classes.row}>
        <Avatar testID="avatar" imageUrl={profile_image_url} size="sm" />
        <Label>{username}</Label>
      </Row>
      <Row className={classes.row}>
        <Button
          testID="button"
          loading={isLoading}
          disabled={isLoading}
          onPress={() => onPress(id)}
        >
          {isBlocked ? 'Unblock' : 'Block'}
        </Button>
      </Row>
    </Row>
  );
};

const classes = {
  row: 'gap-3',
  button: '!py-2',
};

export default BlockListItem;
