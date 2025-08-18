import { getBlockedUserCaches } from '@/graphql/blocked_users';
import { getFavoriteCaches } from '@/graphql/favorites';
import { getFollowCaches } from '@/graphql/follows';
import { getMessages } from '@/graphql/messages';
import { getPostComments } from '@/graphql/post_comments';

export const tableQueryMap = {
  favorites: {
    query: getFavoriteCaches,
    dataKey: 'favoritesCollection',
    primaryKey: ['user_id', 'listing_id'],
  },
  follows: {
    query: getFollowCaches,
    dataKey: 'followsCollection',
    primaryKey: ['follower_user_id', 'followee_user_id'],
  },
  blocked_users: {
    query: getBlockedUserCaches,
    dataKey: 'blocked_usersCollection',
    primaryKey: ['blocker_user_id', 'blocked_user_id'],
  },
  post_comments: {
    query: getPostComments,
    dataKey: 'post_commentsCollection',
    primaryKey: ['id', 'post_id'],
  },
  messages: {
    query: getMessages,
    dataKey: 'messagesCollection',
    primaryKey: ['id'],
  },
};
