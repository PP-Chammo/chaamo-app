import React, { memo, useCallback } from 'react';

import { router } from 'expo-router';

import { Category, ListContainer } from '@/components/molecules';
import { imageCategories } from '@/constants/categories';
import { GetCategoriesQuery, useGetCategoriesQuery } from '@/generated/graphql';
import { DeepGet } from '@/types/helper';

const CategoryList = memo(function CategoryList() {
  const { data, loading } = useGetCategoriesQuery();
  const edges = data?.categoriesCollection?.edges ?? [];

  const handleCtaCards = useCallback(
    (category: string) =>
      router.push({ pathname: '/screens/product-list', params: { category } }),
    [],
  );

  if (loading) {
    return null;
  }

  return (
    <ListContainer<
      DeepGet<GetCategoriesQuery, ['categoriesCollection', 'edges', number]>
    >
      title="Categories"
      onViewAllHref="/screens/categories"
      data={edges}
    >
      {(edge) => (
        <Category
          key={edge.node.name}
          title={edge.node.name}
          image={imageCategories?.[edge.node.name]}
          onPress={handleCtaCards}
        />
      )}
    </ListContainer>
  );
});

export default CategoryList;
