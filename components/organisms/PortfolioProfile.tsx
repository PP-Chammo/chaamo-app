import { remapProps } from 'nativewind';
import { FlatList } from 'react-native';

import { CommonCard } from '@/components/molecules';
import { dummyFeaturedCardList } from '@/constants/dummy';

const FlatListRemapped = remapProps(FlatList, {
  contentContainerClassName: 'contentContainerStyle',
  columnWrapperClassName: 'columnWrapperStyle',
}) as typeof FlatList;

export default function Portfolio() {
  return (
    <FlatListRemapped
      testID="portfolio-profile-list"
      data={dummyFeaturedCardList}
      keyExtractor={(_, index) => index.toString()}
      numColumns={2}
      horizontal={false}
      showsVerticalScrollIndicator={false}
      contentContainerClassName={classes.contentContainer}
      columnWrapperClassName={classes.columnWrapper}
      renderItem={({ item, index }) => {
        const isLast = index === dummyFeaturedCardList.length - 1;
        const isOdd = dummyFeaturedCardList.length % 2 !== 0;
        const shouldNotBeFullWidth = isLast && isOdd;

        return (
          <CommonCard
            key={item.id}
            id={item.id}
            imageUrl={item.imageUrl}
            title={item.title}
            marketPrice={item.marketPrice}
            marketType={item.marketType}
            indicator={item.indicator}
            rightIcon="heart-outline"
            onRightIconPress={() => {
              console.log(`Favorite pressed for card ${item.id}`);
            }}
            className={shouldNotBeFullWidth ? classes.lastCard : classes.card}
          />
        );
      }}
    />
  );
}

const classes = {
  contentContainer: '!p-4.5 !gap-4.5',
  columnWrapper: '!gap-4.5',
  lastCard: 'flex-[0.5] mr-6',
  card: 'flex-1',
};
