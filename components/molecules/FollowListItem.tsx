import React, { Fragment, memo, useCallback, useRef, useState } from 'react';

import { TouchableOpacity, View } from 'react-native';

import {
  Avatar,
  Button,
  ContextMenu,
  Icon,
  Label,
  Row,
} from '@/components/atoms';
import { useBlockedUsers } from '@/hooks/useBlockedUsers';

interface FollowListItemProps {
  userId: string;
  username: string;
  imageUrl: string;
  isLoading?: boolean;
  isFollowing?: boolean;
  onPress?: () => void;
  onToggleFollowPress?: () => void;
  onToggleBlockPress?: () => void;
}

const FollowListItem: React.FC<FollowListItemProps> = memo(
  function FollowListItem({
    userId,
    username,
    imageUrl,
    isLoading,
    isFollowing,
    onPress,
    onToggleFollowPress,
    onToggleBlockPress,
  }) {
    const { getIsBlocked } = useBlockedUsers();
    const [isContextMenuVisible, setIsContextMenuVisible] =
      useState<boolean>(false);

    const dotsRef = useRef<View>(null);

    const handleContextMenuPress = useCallback(() => {
      setIsContextMenuVisible(true);
    }, []);

    const handleCloseContextMenu = useCallback(() => {
      setIsContextMenuVisible(false);
    }, []);

    const handleToggleBlock = useCallback(() => {
      onToggleBlockPress?.();
      handleCloseContextMenu();
    }, [handleCloseContextMenu, onToggleBlockPress]);

    return (
      <Fragment>
        <Row testID="follow-list-item" between>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onPress}
            className={classes.row}
          >
            <Avatar testID="avatar" imageUrl={imageUrl} size="md" />
            <Label>{username}</Label>
          </TouchableOpacity>
          <Row className={classes.row}>
            {!getIsBlocked(userId) && onToggleFollowPress && (
              <Button
                onPress={onToggleFollowPress}
                size="small"
                loading={isLoading}
                disabled={isLoading}
                variant={isFollowing ? 'primary-light' : 'primary'}
              >
                {isFollowing ? 'Unfollow' : 'Follow'}
              </Button>
            )}
            {onToggleBlockPress && (
              <TouchableOpacity
                testID="dots-menu-button"
                ref={dotsRef}
                onPress={handleContextMenuPress}
              >
                <Icon name="dots-vertical" size={24} />
              </TouchableOpacity>
            )}
          </Row>
        </Row>
        {onToggleBlockPress && (
          <ContextMenu
            testID="context-menu"
            visible={isContextMenuVisible}
            onClose={handleCloseContextMenu}
            triggerRef={dotsRef}
          >
            <TouchableOpacity
              className={classes.blockMenu}
              onPress={handleToggleBlock}
            >
              <Label className={classes.blockText}>
                {getIsBlocked(userId) ? 'Unblock' : 'Block'}
              </Label>
            </TouchableOpacity>
          </ContextMenu>
        )}
      </Fragment>
    );
  },
);

const classes = {
  row: 'flex flex-row items-center gap-3',
  blockMenu: 'flex-row items-center py-2 px-3 gap-2',
  blockText: '!text-red-600 text-sm',
};

export default FollowListItem;
