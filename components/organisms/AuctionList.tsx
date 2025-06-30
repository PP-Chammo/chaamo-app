import React, { memo } from 'react';

import { ScrollView } from 'react-native';

import { AuctionCard, GroupWithLink } from '@/components/molecules';
import { dummyAuctionCardList } from '@/constants/dummy';
import { getColor } from '@/utils/getColor';

const AuctionList = memo(function AuctionList() {
  return (
    <GroupWithLink
      title="Auction"
      onViewAllHref="/screens/auction"
      iconName="access-point"
      iconColor={getColor('red-500')}
      className={classes.container}
    >
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName={classes.scrollContainer}
      >
        {dummyAuctionCardList.map((card) => (
          <AuctionCard
            key={card.id}
            imageUrl={card.imageUrl}
            title={card.title}
            price={card.price}
            onFavoritePress={() => {
              console.log(`Favorite pressed for card ${card.id}`);
            }}
          />
        ))}
      </ScrollView>
    </GroupWithLink>
  );
});

const classes = {
  container: 'bg-white',
  scrollContainer: 'flex flex-row p-5 gap-5',
  titleContainer: 'px-5 pt-5',
  viewAllText: 'text-teal-500 font-bold',
};

export default AuctionList;
