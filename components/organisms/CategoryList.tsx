import React, { memo, useCallback } from 'react';

import { router } from 'expo-router';

import { Category, ListContainer } from '@/components/molecules';
import { imageCategories } from '@/constants/categories';
import { useCategoryVar } from '@/hooks/useCategoryVar';
import { useSearchVar } from '@/hooks/useSearchVar';

const CategoryList = memo(function CategoryList() {
  const [, setSearch] = useSearchVar();
  const { data, loading } = useCategoryVar();

  const handleCtaCard = useCallback(
    (id: number) => (category: string) => {
      setSearch({ categoryId: id, category });
      router.push({
        pathname: '/screens/product-list',
        params: { mergedList: 'true' },
      });
    },
    [setSearch],
  );

  if (loading) {
    return null;
  }

  return (
    <ListContainer
      title="Categories"
      onViewAllHref="/screens/categories"
      data={data}
    >
      {(edge) => (
        <Category
          key={edge.node.name}
          title={edge.node.name}
          image={imageCategories?.[edge.node.name]}
          onPress={handleCtaCard(edge.node.id)}
        />
      )}
    </ListContainer>
  );
});

export default CategoryList;
