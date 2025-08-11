import { getBlockedUserCaches } from '@/graphql/blocked_users';
import { getFavoriteCaches } from '@/graphql/favorites';
import { getFollowCaches } from '@/graphql/follows';

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
};
