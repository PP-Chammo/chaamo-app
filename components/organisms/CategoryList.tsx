import React, { memo } from 'react';

import { ScrollView } from 'react-native';

import { Category, GroupWithLink } from '@/components/molecules';
import { categories } from '@/constants/categories';

const CategoryList = memo(function CategoryList() {
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
          />
        ))}
      </ScrollView>
    </GroupWithLink>
  );
});

const classes = {
  titleContainer: 'px-5 pt-5',
  viewAllText: 'text-teal-500 font-bold',
  container: 'flex flex-row p-5 gap-5',
};

export default CategoryList;
