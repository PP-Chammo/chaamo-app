import { useCallback } from 'react';

import { router } from 'expo-router';
import { cssInterop } from 'nativewind';
import { FlatList, View } from 'react-native';

import { Label, ScreenContainer } from '@/components/atoms';
import { Category, Header } from '@/components/molecules';
import { categories } from '@/constants/categories';

cssInterop(FlatList, {
  className: {
    target: 'style',
  },
  contentContainerClassName: {
    target: 'contentContainerStyle',
  },
});

export default function CategoriesScreen() {
  const handleCtaCards = useCallback((query: string) => {
    router.push({ pathname: '/screens/cards', params: { category: query } });
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
        data={categories}
        keyExtractor={(item) => item.title}
        renderItem={({ item, index }) => (
          <View>
            {categories?.[index - 1]?.type !== item.type && (
              <Label variant="subtitle" className={classes.headerCategory}>
                {item.type}
              </Label>
            )}
            <Category
              horizontal
              onPress={handleCtaCards}
              title={item.title}
              image={item.image}
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
  containerBottom: '!bg-gray-50',
  header: 'px-5 bg-white',
  headerCategory: 'py-5',
  list: 'pt-5',
  contentContainer: 'px-5',
};
