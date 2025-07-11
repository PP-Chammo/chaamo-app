import { memo } from 'react';

import { cssInterop } from 'nativewind';
import { FlatList } from 'react-native';

import { CardInfo } from '@/components/molecules';
import { dummyFeaturedCardList } from '@/constants/dummy';

cssInterop(FlatList, {
  contentContainerClassName: {
    target: 'contentContainerStyle',
  },
});

const ProductFixedList = memo(function AllCards() {
  return (
    <FlatList
      showsVerticalScrollIndicator={false}
      data={dummyFeaturedCardList}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <CardInfo
          imageUrl={item.imageUrl}
          title={item.title}
          bidPrice={item.bidPrice}
          currentPrice={item.currentPrice}
          indicator={item.indicator}
          onFavoritePress={() => console.log('Favorite pressed')}
        />
      )}
      contentContainerClassName={classes.contentContainer}
    />
  );
});

const classes = {
  contentContainer: 'gap-4 py-4.5',
};

export default ProductFixedList;
