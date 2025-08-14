import React, { memo, useCallback, useMemo, useRef, useState } from 'react';

import { formatDistanceToNow } from 'date-fns';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import pluralize from 'pluralize';
import { Alert, TouchableOpacity, View } from 'react-native';

import {
  Avatar,
  Button,
  ContextMenu,
  Icon,
  Label,
  Row,
} from '@/components/atoms';
import TextField from '@/components/molecules/TextField';
import { OrderByDirection, useGetPostCommentsQuery } from '@/generated/graphql';
import { getColor } from '@/utils/getColor';

type PostCardProps = {
  showContext: boolean;
  postId: string;
  userId: string;
  username: string;
  userImageUrl?: string;
  contentImageUrl?: string;
  content: string;
  createdAt: string;
  likeCount: number;
  liked: boolean;
  // Optional: called when comment button is pressed
  onCommentPress?: () => void;
  onCommentSubmitPress?: (postId: string, content: string) => void;
  onLikePress?: () => void;
  onBlockPress?: () => void;
};

const PostCard: React.FC<PostCardProps> = memo(function PostCard({
  showContext = true,
  postId,
  userId,
  username,
  userImageUrl,
  contentImageUrl,
  content,
  createdAt,
  likeCount,
  liked,
  onCommentPress,
  onCommentSubmitPress,
  onLikePress,
  onBlockPress,
}) {
  const dotsRef = useRef<View>(null);

  const { data } = useGetPostCommentsQuery({
    fetchPolicy: 'cache-and-network',
    variables: {
      filter: {
        post_id: {
          eq: postId,
        },
      },
      orderBy: {
        created_at: OrderByDirection.ASCNULLSLAST,
      },
    },
  });

  const comments = useMemo(
    () => data?.post_commentsCollection?.edges ?? [],
    [data?.post_commentsCollection?.edges],
  );

  const [isContextMenuVisible, setIsContextMenuVisible] = useState(false);
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [comment, setComment] = useState('');

  const handleContextMenuPress = useCallback(
    () => setIsContextMenuVisible(!isContextMenuVisible),
    [isContextMenuVisible],
  );

  const handleBlockPress = useCallback(() => {
    handleContextMenuPress();
    Alert.alert('Block Post', 'Are you sure block all post from this user?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Block',
        onPress: onBlockPress,
      },
    ]);
  }, [handleContextMenuPress, onBlockPress]);

  const handleReportPress = useCallback(() => {
    handleContextMenuPress();
    router.push({
      pathname: '/screens/report',
      params: { postId, userId },
    });
  }, [handleContextMenuPress, postId, userId]);

  const handleCommentSubmit = useCallback(() => {
    if (onCommentSubmitPress) {
      onCommentSubmitPress(postId, comment);
      setComment('');
    }
  }, [onCommentSubmitPress, postId, comment]);

  return (
    <View testID="post-card" className={classes.postCard}>
      <Row className={classes.postHeader}>
        <View className={classes.containerLeft}>
          {userImageUrl ? (
            <Image source={{ uri: userImageUrl }} className={classes.avatar} />
          ) : (
            <View className={classes.avatar}>
              <Icon name="account" size={30} color={getColor('gray-400')} />
            </View>
          )}
          <View className={classes.containerUser}>
            <Label className={classes.postUser}>{username}</Label>
            <Row>
              <Icon name="earth" size={14} color={getColor('gray-400')} />
              <Label className={classes.postTime}>
                Posted{' '}
                {formatDistanceToNow(new Date(createdAt), {
                  addSuffix: true,
                })}
              </Label>
            </Row>
          </View>
        </View>
        {showContext && (
          <>
            <TouchableOpacity
              testID="post-context-menu"
              onPress={handleContextMenuPress}
              className={classes.containerPostMenu}
              ref={dotsRef}
            >
              <Icon
                name="dots-vertical"
                size={20}
                className={classes.postMenu}
              />
            </TouchableOpacity>
            <ContextMenu
              visible={isContextMenuVisible}
              onClose={handleContextMenuPress}
              triggerRef={dotsRef}
              menuHeight={20}
            >
              <TouchableOpacity
                onPress={handleBlockPress}
                className={classes.contextMenuItem}
              >
                <Label className={classes.contextMenuBlockLabel}>Block</Label>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleReportPress}
                className={classes.contextMenuItem}
              >
                <Label className={classes.contextMenuReportLabel}>Report</Label>
              </TouchableOpacity>
            </ContextMenu>
          </>
        )}
      </Row>
      {contentImageUrl && (
        <View className={classes.containerPostImage}>
          <Image
            source={{ uri: contentImageUrl }}
            className={classes.postImage}
          />
        </View>
      )}
      <Label className={classes.postText}>{content}</Label>
      <Row className={classes.postActions}>
        <Button
          testID="comment-button"
          variant="ghost"
          size="small"
          onPress={() => {
            setShowCommentInput((prev) => !prev);
            // Trigger callback for tests and external handlers
            onCommentPress?.();
          }}
          icon="comment-outline"
          iconSize={22}
          iconColor={getColor('primary-500')}
          className={classes.actionButton}
          textClassName={classes.actionButtonTealText}
        >
          {comments?.length > 0
            ? pluralize('Comment', comments?.length, true)
            : 'Comment'}
        </Button>
        <Button
          testID="like-button"
          variant="ghost"
          size="small"
          onPress={onLikePress}
          icon={liked ? 'heart' : 'heart-outline'}
          iconSize={22}
          iconColor={getColor(liked ? 'red-500' : 'gray-500')}
          className={classes.actionButton}
          textClassName={classes.actionButtonText}
        >
          {likeCount > 0 ? pluralize('Like', likeCount, true) : 'Like'}
        </Button>
      </Row>
      {showCommentInput && (
        <View className={classes.commentContainer}>
          <View className={classes.commentsContainer}>
            {comments.map((comment) => (
              <Row key={comment?.node?.id} className={classes.commentRow}>
                <Avatar
                  size="xs"
                  imageUrl={comment?.node?.profiles?.profile_image_url ?? ''}
                />
                <View className={classes.commentUserContainer}>
                  <Row between className={classes.commentUserHeader}>
                    <Label className={classes.commentUsername}>
                      {comment?.node?.profiles?.username}
                    </Label>
                    <Label className={classes.commentTime}>
                      {formatDistanceToNow(
                        new Date(comment?.node?.created_at),
                        { addSuffix: true },
                      )}
                    </Label>
                  </Row>
                  <Label className={classes.commentContent}>
                    {comment?.node?.content}
                  </Label>
                </View>
              </Row>
            ))}
          </View>
          <Row className={classes.commentInputContainer}>
            <TextField
              name="comment"
              onChange={({ value }) => setComment(value)}
              value={comment}
              placeholder="Add a comment..."
              className={classes.commentInput}
            />
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handleCommentSubmit}
              className={classes.sendButton}
              disabled={comment.trim().length === 0}
            >
              <Icon name="send" size={20} color={getColor('white')} />
            </TouchableOpacity>
          </Row>
        </View>
      )}
    </View>
  );
});

const classes = {
  postCard: 'bg-white gap-2.5 shadow',
  postHeader: 'flex items-center justify-between px-5 pt-4',
  containerLeft: 'flex flex-row items-center gap-3',
  containerUser: 'gap-0.5',
  avatar: 'w-12 h-12 bg-gray-300 items-center justify-center rounded-full',
  postUser: 'font-semibold text-base',
  postTime: 'text-xs !text-gray-400',
  containerPostMenu: 'p-1',
  postMenu: 'text-gray-600',
  containerPostImage: 'px-5 pb-5',
  postImage: 'w-full h-64 bg-gray-200 rounded-lg',
  postText: 'text-base leading-5.5 !text-gray-700 px-5',
  postActions: 'flex justify-end gap-0 px-5 py-2',
  actionButton: '!gap-0 !px-3',
  actionButtonTealText: '!text-base !font-medium text-primary-500 !px-2',
  actionButtonText: '!text-base !font-medium text-gray-500 !px-2',
  contextMenuItem: 'py-1',
  contextMenuBlockLabel: '!text-red-600',
  contextMenuReportLabel: '!text-slate-600',
  commentsContainer: 'pb-2',
  commentContainer: 'px-5 pb-2',
  commentRow: 'gap-2 py-2 !items-start',
  commentInputContainer: 'gap-4.5',
  commentInput: 'flex-1',
  sendButton:
    'h-12 w-12 bg-primary-500 !rounded-full items-center justify-center disabled:opacity-50',
  commentUserContainer: 'flex-1 gap-1 bg-gray-50 p-2 rounded-lg',
  commentUserHeader: 'flex-1',
  commentUsername: 'font-semibold text-base',
  commentTime: 'text-xs !text-gray-400',
  commentContent: 'text-base leading-5.5 !text-gray-700',
};

export default PostCard;
