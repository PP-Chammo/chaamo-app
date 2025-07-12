import { memo } from 'react';

import { cssInterop } from 'nativewind';
import { FlatList } from 'react-native';

import { CardItem } from '@/components/molecules';
import { dummyFeaturedCardList } from '@/constants/dummy';

cssInterop(FlatList, {
  contentContainerClassName: {
    target: 'contentContainerStyle',
  },
});

const ProductCardList = memo(function AllCards() {
  return (
    <FlatList
      testID="product-card-list"
      showsVerticalScrollIndicator={false}
      data={dummyFeaturedCardList}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <CardItem
          imageUrl={item.imageUrl}
          title={item.title}
          subtitle={item.title}
          price={item.price}
          date={item.date}
          marketPrice={item.marketPrice}
          marketType={item.marketType}
          indicator={item.indicator}
          rightIcon="heart-outline"
          className="bg-red-200"
          rightIconSize={18}
          onRightIconPress={() => {
            console.log(`Favorite pressed for card ${item.id}`);
          }}
        />
      )}
      contentContainerClassName={classes.contentContainer}
    />
  );
});

const classes = {
  contentContainer: 'gap-4 py-4.5',
};

export default ProductCardList;
