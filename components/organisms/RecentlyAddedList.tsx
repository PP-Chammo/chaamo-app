import { memo } from 'react';

import { CommonCard, ListContainer } from '@/components/molecules';
import { dummyFeaturedCardList } from '@/constants/dummy';

const RecentlyAddedList = memo(function RecentlyAddedList() {
  return (
    <ListContainer
      title="Recently Added"
      onViewAllHref="/screens/product-list"
      data={dummyFeaturedCardList}
    >
      {(featured: (typeof dummyFeaturedCardList)[number]) => (
        <CommonCard
          id={featured.id}
          key={featured.id}
          imageUrl={featured.imageUrl}
          title={featured.title}
          price={featured.price}
          marketPrice={featured.marketPrice}
          marketType={featured.marketType}
          indicator={featured.indicator}
          rightIcon="heart-outline"
          onRightIconPress={() => {
            console.log(`Favorite pressed for card ${featured.id}`);
          }}
        />
      )}
    </ListContainer>
  );
});

export default RecentlyAddedList;
