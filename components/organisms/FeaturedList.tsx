import React, { memo } from 'react';

import { CommonCard, ListContainer } from '@/components/molecules';
import { dummyFeaturedCardList } from '@/constants/dummy';

const FeaturedList = memo(function FeaturedList() {
  return (
    <ListContainer
      title="Featured"
      onViewAllHref="/screens/product-list"
      data={dummyFeaturedCardList}
    >
      {(card: (typeof dummyFeaturedCardList)[number]) => (
        <CommonCard
          key={card.id}
          id={card.id}
          imageUrl={card.imageUrl}
          title={card.title}
          price={card.price}
          marketPrice={card.marketPrice}
          marketType={card.marketType}
          indicator={card.indicator}
          rightIcon="heart-outline"
          rightIconSize={18}
          onRightIconPress={() => {
            console.log(`Favorite pressed for card ${card.id}`);
          }}
        />
      )}
    </ListContainer>
  );
});

export default FeaturedList;
