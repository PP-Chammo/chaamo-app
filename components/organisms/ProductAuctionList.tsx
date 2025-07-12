import { memo } from 'react';

import { router } from 'expo-router';
import { cssInterop } from 'nativewind';
import { FlatList } from 'react-native';

import { AuctionItem } from '@/components/molecules';
import { dummyFeaturedCardList } from '@/constants/dummy';

cssInterop(FlatList, {
  contentContainerClassName: {
    target: 'contentContainerStyle',
  },
});

const ProductAuctionList = memo(function ProductAuctionList() {
  return (
    <FlatList
      testID="product-auction-list"
      showsVerticalScrollIndicator={false}
      data={dummyFeaturedCardList}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <AuctionItem
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
          onPress={() => router.push('/screens/auction-detail')}
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

export default ProductAuctionList;
