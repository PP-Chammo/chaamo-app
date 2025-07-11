import React, { memo, useCallback } from 'react';

import { router } from 'expo-router';

import { Category, ListContainer } from '@/components/molecules';
import { categories } from '@/constants/categories';

const CategoryList = memo(function CategoryList() {
  const handleCtaCards = useCallback(
    (category: string) =>
      router.push({ pathname: '/screens/product-list', params: { category } }),
    [],
  );

  return (
    <ListContainer
      title="Categories"
      onViewAllHref="/screens/categories"
      data={categories}
    >
      {(category: (typeof categories)[number]) => (
        <Category
          key={category.title}
          title={category.title}
          image={category.image}
          onPress={handleCtaCards}
        />
      )}
    </ListContainer>
  );
});

export default CategoryList;
