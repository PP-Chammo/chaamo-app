import React from 'react';

import { TouchableOpacity } from 'react-native';

import { Avatar, Button, Label, Row } from '@/components/atoms';

interface BlockListItemProps {
  username: string;
  imageUrl: string;
  isLoading?: boolean;
  isBlocked?: boolean;
  onPress: () => void;
  onToggleBlockPress: () => void;
}

const BlockListItem: React.FC<BlockListItemProps> = ({
  username,
  imageUrl,
  isLoading,
  isBlocked,
  onPress,
  onToggleBlockPress,
}) => {
  return (
    <Row between>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={onPress}
        className={classes.row}
      >
        <Avatar testID="avatar" imageUrl={imageUrl} size="sm" />
        <Label>{username}</Label>
      </TouchableOpacity>
      <Row className={classes.row}>
        <Button
          testID="button"
          size="small"
          variant={isBlocked ? 'danger-light' : 'danger'}
          loading={isLoading}
          disabled={isLoading}
          onPress={onToggleBlockPress}
        >
          {isBlocked ? 'Unblock' : 'Block'}
        </Button>
      </Row>
    </Row>
  );
};

const classes = {
  row: 'flex flex-row items-center gap-3',
  button: '!py-2',
};

export default BlockListItem;
