import { remapProps } from 'nativewind';
import { FlatList } from 'react-native';

import { Boost } from '@/components/atoms';
import { Card } from '@/components/molecules';
import { dummyFeaturedCardList } from '@/constants/dummy';
import { CardItem } from '@/domains/card-item.types';

const CustomizedFlatList = remapProps(FlatList, {
  columnWrapperClassName: 'columnWrapperStyle',
});

export default function SoldItemsScreen() {
  return (
    <CustomizedFlatList
      data={dummyFeaturedCardList}
      keyExtractor={(_, index) => index.toString()}
      numColumns={2}
      horizontal={false}
      showsVerticalScrollIndicator={false}
      columnWrapperClassName={classes.columnWrapper}
      renderItem={({ item, index }) => {
        const cardItem = item as CardItem;
        const isLast = index === dummyFeaturedCardList.length - 1;
        const isOdd = dummyFeaturedCardList.length % 2 !== 0;
        const shouldNotBeFullWidth = isLast && isOdd;

        return (
          <Card
            key={cardItem.id}
            imageUrl={cardItem.imageUrl}
            title={cardItem.title}
            bidPrice={cardItem.bidPrice || ''}
            indicator={cardItem.indicator}
            rightIcon={<Boost boosted={cardItem.boosted} />}
            mode={shouldNotBeFullWidth ? 'half' : 'full'}
          />
        );
      }}
    />
  );
}

const classes = {
  columnWrapper: 'gap-8 mb-5',
};
