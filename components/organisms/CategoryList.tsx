import React, { memo, useCallback } from 'react';

import { router } from 'expo-router';
import { ScrollView } from 'react-native';

import { Category, GroupWithLink } from '@/components/molecules';
import { categories } from '@/constants/categories';

const CategoryList = memo(function CategoryList() {
  const handleCtaCards = useCallback(
    (category: string) =>
      router.push({ pathname: '/screens/cards', params: { category } }),
    [],
  );

  return (
    <GroupWithLink title="Categories" onViewAllHref="/screens/categories">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName={classes.container}
      >
        {categories.map((category) => (
          <Category
            key={category.title}
            title={category.title}
            image={category.image}
            onPress={handleCtaCards}
          />
        ))}
      </ScrollView>
    </GroupWithLink>
  );
});

const classes = {
  titleContainer: 'px-4.5 pt-5',
  viewAllText: 'text-teal-500 font-bold',
  container: 'flex flex-row p-4.5 gap-5',
};

export default CategoryList;
