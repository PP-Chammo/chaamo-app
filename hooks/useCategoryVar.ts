import { useMemo } from 'react';

import { useApolloClient } from '@apollo/client';

import { GetCategoriesQuery, useGetCategoriesQuery } from '@/generated/graphql';
import { getCategories } from '@/graphql/categories';

type CategoryEdge = NonNullable<
  NonNullable<GetCategoriesQuery['categoriesCollection']>['edges']
>[number];

type CategoryHookReturnType = {
  data: CategoryEdge[];
  loading: boolean;
};

export function useCategoryVar(): CategoryHookReturnType {
  const client = useApolloClient();

  const hasCachedData = useMemo(() => {
    try {
      const cacheResult = client.readQuery<GetCategoriesQuery>({
        query: getCategories,
      });
      return !!cacheResult?.categoriesCollection?.edges?.length;
    } catch {
      return false;
    }
  }, [client]);

  const { data: categories, loading } = useGetCategoriesQuery({
    fetchPolicy: hasCachedData ? 'cache-only' : 'cache-and-network',
    nextFetchPolicy: 'cache-only',
  });

  const data: CategoryEdge[] = useMemo(() => {
    return (categories?.categoriesCollection?.edges as CategoryEdge[]) ?? [];
  }, [categories?.categoriesCollection?.edges]);

  return { data, loading };
}
