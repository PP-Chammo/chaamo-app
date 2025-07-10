import React, { memo } from 'react';

import { router } from 'expo-router';
import { ScrollView } from 'react-native';

import { FavoriteButton } from '@/components/atoms';
import { Card, GroupWithLink } from '@/components/molecules';
import { dummyPortfolioCardList } from '@/constants/dummy';

const PortfolioList = memo(function PortfolioList() {
  return (
    <GroupWithLink
      title="Top 3 Collections"
      titleLink="View portfolio"
      onViewAllHref="/screens/portfolio-list"
      className={classes.headerContainer}
    >
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName={classes.container}
      >
        {dummyPortfolioCardList.map((card) => (
          <Card
            key={card.id}
            imageUrl={card.imageUrl}
            title={card.title}
            currentPrice={card.currentPrice}
            bidPrice={card.bidPrice}
            indicator={card.indicator}
            rightComponent={
              <FavoriteButton
                onPress={() => {
                  console.log(`Favorite pressed for card ${card.id}`);
                }}
              />
            }
            onPress={() => router.push('/screens/portfolio-detail')}
          />
        ))}
      </ScrollView>
    </GroupWithLink>
  );
});

const classes = {
  headerContainer: 'pt-5',
  titleContainer: 'px-4.5 pt-5',
  viewAllText: 'text-teal-500 font-bold',
  container: 'flex flex-row p-4.5 gap-5',
};

export default PortfolioList;
