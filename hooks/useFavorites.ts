import { useCallback, useMemo } from 'react';

import { useApolloClient } from '@apollo/client';

import {
  GetFavoritesQuery,
  useGetFavoriteCachesQuery,
} from '@/generated/graphql';
import { getFavoriteCaches } from '@/graphql/favorites';

import { useUserVar } from './useUserVar';

export function useFavorites() {
  const [user] = useUserVar();
  const client = useApolloClient();

  const hasCachedData = useMemo(() => {
    try {
      const cache = client.cache;
      const cacheResult = cache.readQuery<GetFavoritesQuery>({
        query: getFavoriteCaches,
        variables: {
          filter: {
            user_id: { eq: user?.id },
          },
        },
      });
      return !!cacheResult?.favoritesCollection?.edges?.length;
    } catch {
      return false;
    }
  }, [client, user?.id]);

  const { data } = useGetFavoriteCachesQuery({
    skip: !user?.id,
    fetchPolicy: hasCachedData ? 'cache-only' : 'cache-and-network',
    nextFetchPolicy: 'cache-only',
    variables: {
      filter: {
        user_id: { eq: user?.id },
      },
    },
    onError: (err) => {
      console.error('useFavorites error:', err);
    },
  });

  const favorites = useMemo(() => {
    if (!data?.favoritesCollection?.edges) {
      return [];
    }
    return data?.favoritesCollection?.edges || [];
  }, [data?.favoritesCollection?.edges]);

  const getIsFavorite = useCallback(
    (listingId: string) => {
      return favorites.some(
        (favorite) => favorite.node.listing_id === listingId,
      );
    },
    [favorites],
  );

  return { favorites, getIsFavorite };
}
