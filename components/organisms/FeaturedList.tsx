import React, { memo } from 'react';

import { ScrollView } from 'react-native';

import { FavoriteButton } from '@/components/atoms';
import { Card, GroupWithLink } from '@/components/molecules';
import { dummyFeaturedCardList } from '@/constants/dummy';

const FeaturedList = memo(function FeaturedList() {
  return (
    <GroupWithLink title="Featured" onViewAllHref="/screens/featured">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName={classes.container}
      >
        {dummyFeaturedCardList.map((card) => (
          <Card
            featured
            key={card.id}
            imageUrl={card.imageUrl}
            title={card.title}
            currentPrice={card.currentPrice}
            bidPrice={card.bidPrice}
            indicator={card.indicator}
            rightIcon={
              <FavoriteButton
                onPress={() => {
                  console.log(`Favorite pressed for card ${card.id}`);
                }}
              />
            }
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

export default FeaturedList;
