import React, { Fragment, memo, useCallback, useRef, useState } from 'react';

import { Alert, TouchableOpacity, View } from 'react-native';

import {
  Avatar,
  Button,
  ContextMenu,
  Icon,
  Label,
  Row,
} from '@/components/atoms';

interface FollowListItemProps {
  name: string;
  imageUrl: string;
  onUnfollowPress?: () => void;
  onBlockPress?: () => void;
  isFollowing?: boolean;
}

const FollowListItem: React.FC<FollowListItemProps> = memo(
  function FollowListItem({
    name,
    imageUrl,
    onUnfollowPress,
    onBlockPress,
    isFollowing,
  }) {
    const [isContextMenuVisible, setIsContextMenuVisible] =
      useState<boolean>(false);

    const dotsRef = useRef<View>(null);

    const handleContextMenuPress = useCallback(() => {
      setIsContextMenuVisible(true);
    }, []);

    const handleCloseContextMenu = useCallback(() => {
      setIsContextMenuVisible(false);
    }, []);

    const handleBlock = useCallback(() => {
      Alert.alert('Blocked', 'User Blocked');
      onBlockPress?.();
      handleCloseContextMenu();
    }, [handleCloseContextMenu, onBlockPress]);

    return (
      <Fragment>
        <Row testID="follow-list-item" between>
          <Row className={classes.row}>
            <Avatar testID="avatar" imageUrl={imageUrl} size="md" />
            <Label>{name}</Label>
          </Row>
          <Row className={classes.row}>
            {isFollowing && <Button onPress={onUnfollowPress}>Unfollow</Button>}
            <TouchableOpacity
              testID="dots-menu-button"
              ref={dotsRef}
              onPress={handleContextMenuPress}
            >
              <Icon name="dots-vertical" size={24} />
            </TouchableOpacity>
          </Row>
        </Row>

        <ContextMenu
          testID="context-menu"
          visible={isContextMenuVisible}
          onClose={handleCloseContextMenu}
          triggerRef={dotsRef}
        >
          <TouchableOpacity className={classes.blockMenu} onPress={handleBlock}>
            <Label className={classes.blockText}>Block</Label>
          </TouchableOpacity>
        </ContextMenu>
      </Fragment>
    );
  },
);

const classes = {
  row: 'gap-3',
  blockMenu: 'flex-row items-center py-2 px-3 gap-2',
  blockText: '!text-red-600 text-sm',
};

export default FollowListItem;
