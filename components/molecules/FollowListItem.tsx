import React, { memo, useCallback, useRef, useState } from 'react';

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
  isFollowing?: boolean;
  onPressFollow?: () => void;
  onBlock?: () => void;
}

const FollowListItem: React.FC<FollowListItemProps> = memo(
  function FollowListItem({
    name,
    imageUrl,
    isFollowing,
    onPressFollow,
    onBlock,
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
      onBlock?.();
      handleCloseContextMenu();
    }, [handleCloseContextMenu, onBlock]);

    return (
      <>
        <Row between>
          <Row className={classes.row}>
            <Avatar imageUrl={imageUrl} size={50} />
            <Label>{name}</Label>
          </Row>
          <Row className={classes.row}>
            {isFollowing && <Button onPress={onPressFollow}>Unfollow</Button>}
            <TouchableOpacity ref={dotsRef} onPress={handleContextMenuPress}>
              <Icon name="dots-vertical" size={24} />
            </TouchableOpacity>
          </Row>
        </Row>

        <ContextMenu
          visible={isContextMenuVisible}
          onClose={handleCloseContextMenu}
          triggerRef={dotsRef}
        >
          <TouchableOpacity className={classes.blockMenu} onPress={handleBlock}>
            <Label className={classes.blockText}>Block</Label>
          </TouchableOpacity>
        </ContextMenu>
      </>
    );
  },
);

const classes = {
  row: 'gap-3',
  blockMenu: 'flex-row items-center py-2 px-3 gap-2',
  blockText: '!text-red-600 text-sm',
};

export default FollowListItem;
