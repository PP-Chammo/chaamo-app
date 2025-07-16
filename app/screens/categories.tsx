import { useCallback } from 'react';

import { router } from 'expo-router';
import { upperFirst } from 'lodash';
import { cssInterop } from 'nativewind';
import { FlatList, View } from 'react-native';

import { Label, ScreenContainer } from '@/components/atoms';
import { Category, Header } from '@/components/molecules';
import { imageCategories } from '@/constants/categories';
import { useGetCategoriesQuery } from '@/generated/graphql';

cssInterop(FlatList, {
  className: {
    target: 'style',
  },
  contentContainerClassName: {
    target: 'contentContainerStyle',
  },
});

export default function CategoriesScreen() {
  const { data } = useGetCategoriesQuery();
  const edges = data?.categoriesCollection?.edges ?? [];

  const handleCtaCards = useCallback((query: string) => {
    router.push({
      pathname: '/screens/product-list',
      params: { category: query },
    });
  }, []);

  return (
    <ScreenContainer classNameTop={classes.containerTop}>
      <Header
        title="All Categories"
        onBackPress={() => router.back()}
        className={classes.header}
      />
      <FlatList
        showsVerticalScrollIndicator={false}
        data={edges}
        keyExtractor={(item) => item.node.name}
        renderItem={({ item, index }) => (
          <View>
            {edges?.[index - 1]?.node.type !== item.node.type && (
              <Label variant="subtitle" className={classes.headerCategory}>
                {upperFirst(item.node.type)}
              </Label>
            )}
            <Category
              horizontal
              onPress={handleCtaCards}
              title={item.node.name}
              image={imageCategories?.[item.node.name]}
            />
          </View>
        )}
        className={classes.list}
        contentContainerClassName={classes.contentContainer}
      />
    </ScreenContainer>
  );
}

const classes = {
  containerTop: 'bg-white',
  header: 'bg-white',
  headerCategory: 'py-5',
  list: 'pt-4.5',
  contentContainer: 'gap-5 px-4.5',
};
