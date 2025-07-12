import React, { memo } from 'react';

import { router } from 'expo-router';

import { AuctionCard, ListContainer } from '@/components/molecules';
import { dummyAuctionCardList } from '@/constants/dummy';
import { getColor } from '@/utils/getColor';

const AuctionList = memo(function AuctionList() {
  return (
    <ListContainer
      title="Auction"
      onViewAllHref="/screens/product-list"
      icon="access-point"
      iconColor={getColor('red-500')}
      className={classes.container}
      headerClassName={classes.headerContainer}
      data={dummyAuctionCardList}
    >
      {(card: (typeof dummyAuctionCardList)[number]) => (
        <AuctionCard
          key={card.id}
          id={card.id}
          imageUrl={card.imageUrl}
          title={card.title}
          price={card.price}
          rightIcon="heart-outline"
          rightIconSize={18}
          onPress={() => router.push('/screens/auction-detail')}
          onRightIconPress={() => {
            console.log(`Favorite pressed for card ${card.id}`);
          }}
        />
      )}
    </ListContainer>
  );
});

const classes = {
  headerContainer: 'pt-5',
  container: 'bg-white',
};

export default AuctionList;
