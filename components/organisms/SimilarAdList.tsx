import React, { memo } from 'react';

import { router } from 'expo-router';

import { CommonCard, ListContainer } from '@/components/molecules';
import { dummyFeaturedCardList } from '@/constants/dummy';

const SimilarAdList = memo(function SimilarAdList() {
  return (
    <ListContainer noLink title="Similar Ads" data={dummyFeaturedCardList}>
      {(item: (typeof dummyFeaturedCardList)[number]) => (
        <CommonCard
          id={item.id}
          imageUrl={item.imageUrl}
          title={item.title}
          price={item.price}
          marketPrice={item.marketPrice}
          marketType={item.marketType}
          indicator={item.indicator}
          featured={item.boosted}
          onPress={() => router.push('/screens/product-detail')}
        />
      )}
    </ListContainer>
  );
});

export default SimilarAdList;
