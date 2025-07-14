import React, { memo, useCallback } from 'react';

import { Image, TouchableOpacity, View } from 'react-native';

import { Button, Icon, Label, Row } from '@/components/atoms';
import { Post } from '@/types/post';
import { getColor } from '@/utils/getColor';

type PostCardProps = {
  post: Post;
  onCommentPress?: () => void;
  onLikePress?: () => void;
  onContextPress?: () => void;
};

const PostCard: React.FC<PostCardProps> = memo(function PostCard({
  post,
  onCommentPress,
  onLikePress,
  onContextPress,
}) {
  const getDateByNow = useCallback((date: string) => {
    const postDate = new Date(date);
    const now = new Date();
    const diffInSeconds = Math.floor(
      (now.getTime() - postDate.getTime()) / 1000,
    );
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays > 0) {
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    } else if (diffInHours > 0) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else if (diffInMinutes > 0) {
      return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    } else {
      return 'Just now';
    }
  }, []);

  return (
    <View testID="post-card" key={post.id} className={classes.postCard}>
      <Row className={classes.postHeader}>
        <View className={classes.containerLeft}>
          <View className={classes.avatar} />
          <View className={classes.containerUser}>
            <Label className={classes.postUser}>{post?.user?.name ?? ''}</Label>
            <Row>
              <Icon name="earth" size={14} color={getColor('gray-400')} />
              <Label className={classes.postTime}>
                Posted {getDateByNow(post.date)}
              </Label>
            </Row>
          </View>
        </View>
        <TouchableOpacity
          testID="post-context-menu"
          onPress={onContextPress}
          className={classes.containerPostMenu}
        >
          <Icon name="dots-vertical" size={20} className={classes.postMenu} />
        </TouchableOpacity>
      </Row>
      {post.image && (
        <View className={classes.containerPostImage}>
          <Image source={{ uri: post.image }} className={classes.postImage} />
        </View>
      )}
      <Label className={classes.postText}>{post.text}</Label>
      <Row className={classes.postActions}>
        <Button
          testID="comment-button"
          variant="ghost"
          size="small"
          onPress={onCommentPress}
          icon="comment-outline"
          iconSize={22}
          iconColor={getColor('primary-500')}
          className={classes.actionButton}
          textClassName={classes.actionButtonTealText}
        >
          Comment
        </Button>
        <Button
          testID="like-button"
          variant="ghost"
          size="small"
          onPress={onLikePress}
          icon="heart-outline"
          iconSize={22}
          iconColor={getColor('gray-500')}
          className={classes.actionButton}
          textClassName={classes.actionButtonText}
        >
          Like
        </Button>
      </Row>
    </View>
  );
});

const classes = {
  postCard: 'bg-white gap-2.5 shadow',
  postHeader: 'flex items-center justify-between px-5 pt-4',
  containerLeft: 'flex flex-row items-center gap-3',
  containerUser: 'gap-0.5',
  avatar: 'w-12 h-12 bg-gray-300 rounded-full',
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
};

export default PostCard;
