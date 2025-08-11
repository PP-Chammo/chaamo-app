import { useCallback, useMemo } from 'react';

import { useApolloClient } from '@apollo/client';

import { GetFollowsQuery, useGetFollowCachesQuery } from '@/generated/graphql';
import { getFollowCaches } from '@/graphql/follows';

import { useUserVar } from './useUserVar';

export function useFollows(userId?: string) {
  const [user] = useUserVar();
  const client = useApolloClient();

  const id = useMemo(() => userId ?? user?.id, [userId, user?.id]);

  const hasCachedData = useMemo(() => {
    try {
      const cache = client.cache;
      const cacheResult = cache.readQuery<GetFollowsQuery>({
        query: getFollowCaches,
        variables: {
          filter: {
            or: [
              { follower_user_id: { eq: id } },
              { followee_user_id: { eq: id } },
            ],
          },
        },
      });
      return !!cacheResult?.followsCollection?.edges?.length;
    } catch {
      return false;
    }
  }, [client.cache, id]);

  const { data } = useGetFollowCachesQuery({
    skip: !userId && !user?.id,
    fetchPolicy: hasCachedData ? 'cache-only' : 'cache-and-network',
    nextFetchPolicy: 'cache-only',
    variables: {
      filter: {
        or: [
          { follower_user_id: { eq: id } },
          { followee_user_id: { eq: id } },
        ],
      },
    },
    onError: (err) => {
      console.error('useFollows error:', err);
    },
  });

  const followers = useMemo(() => {
    if (!data?.followsCollection?.edges) {
      return [];
    }
    return (
      data?.followsCollection?.edges.filter(
        (follow) => follow.node.followee_user_id === id,
      ) || []
    );
  }, [data?.followsCollection?.edges, id]);

  const followings = useMemo(() => {
    if (!data?.followsCollection?.edges) {
      return [];
    }
    return (
      data?.followsCollection?.edges.filter(
        (follow) => follow.node.follower_user_id === id,
      ) || []
    );
  }, [data?.followsCollection?.edges, id]);

  const getIsFollowing = useCallback(
    (followeeUserId: string) => {
      return data?.followsCollection?.edges?.some(
        (follow) =>
          follow.node.follower_user_id === user?.id &&
          follow.node.followee_user_id === followeeUserId,
      );
    },
    [data?.followsCollection?.edges, user?.id],
  );

  const getIsFollower = useCallback(
    (followerUserId: string) => {
      return data?.followsCollection?.edges?.some(
        (follow) =>
          follow.node.follower_user_id === followerUserId &&
          follow.node.followee_user_id === user?.id,
      );
    },
    [data?.followsCollection?.edges, user?.id],
  );

  return { followers, followings, getIsFollowing, getIsFollower };
}
