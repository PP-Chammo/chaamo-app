import { useCallback, useMemo } from 'react';

import { useApolloClient } from '@apollo/client';

import {
  GetBlockedUserCachesQuery,
  useGetBlockedUserCachesQuery,
} from '@/generated/graphql';
import { getBlockedUserCaches } from '@/graphql/blocked_users';

import { useUserVar } from './useUserVar';

export function useBlockedUsers() {
  const [user] = useUserVar();
  const client = useApolloClient();

  const hasCachedData = useMemo(() => {
    try {
      const cache = client.cache;
      const cacheResult = cache.readQuery<GetBlockedUserCachesQuery>({
        query: getBlockedUserCaches,
        variables: {
          filter: {
            blocker_user_id: { eq: user?.id },
          },
        },
      });
      return !!cacheResult?.blocked_usersCollection?.edges?.length;
    } catch {
      return false;
    }
  }, [client, user?.id]);

  const { data } = useGetBlockedUserCachesQuery({
    skip: !user?.id,
    fetchPolicy: hasCachedData ? 'cache-only' : 'cache-and-network',
    nextFetchPolicy: 'cache-only',
    variables: {
      filter: {
        blocker_user_id: { eq: user?.id },
      },
    },
    onError: (err) => {
      console.error('useBlockedUsers error:', err);
    },
  });

  const blockedUsers = useMemo(() => {
    if (!data?.blocked_usersCollection?.edges) {
      return [];
    }
    return data?.blocked_usersCollection?.edges || [];
  }, [data?.blocked_usersCollection?.edges]);

  const getIsBlocked = useCallback(
    (blockedUserId: string) => {
      return blockedUsers.some(
        (blockedUser) => blockedUser.node.blocked_user_id === blockedUserId,
      );
    },
    [blockedUsers],
  );

  return { blockedUsers, getIsBlocked };
}
