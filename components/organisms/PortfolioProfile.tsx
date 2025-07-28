import { useMemo, useState } from 'react';

import { remapProps } from 'nativewind';
import { FlatList, View } from 'react-native';

import { Icon, Label } from '@/components/atoms';
import { CommonCard, Select } from '@/components/molecules';
import { dummyPortfolioList } from '@/constants/dummy';
import { portfolioFilters } from '@/constants/filters';
import { getColor } from '@/utils/getColor';

const FlatListRemapped = remapProps(FlatList, {
  contentContainerClassName: 'contentContainerStyle',
  columnWrapperClassName: 'columnWrapperStyle',
}) as typeof FlatList;

export default function Portfolio() {
  const [filter, setFilter] = useState('all');

  const filteredList = useMemo(
    () =>
      dummyPortfolioList.filter((item) => {
        if (filter === 'buy-now') return item.listing_type === 'buy-now';
        if (filter === 'auction') return item.listing_type === 'auction';
        if (filter === 'portfolio') return item.listing_type === 'portfolio';
        if (filter === 'boosted') return item.boosted;
        return true;
      }),
    [filter],
  );

  const _renderContent = useMemo(() => {
    if (filteredList.length)
      return (
        <FlatListRemapped
          testID="portfolio-profile-list"
          data={filteredList}
          keyExtractor={(_, index) => index.toString()}
          numColumns={2}
          horizontal={false}
          showsVerticalScrollIndicator={false}
          contentContainerClassName={classes.contentContainer}
          columnWrapperClassName={classes.columnWrapper}
          renderItem={({ item, index }) => {
            const isLast = index === filteredList.length - 1;
            const isOdd = filteredList.length % 2 !== 0;
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
                className={
                  shouldNotBeFullWidth ? classes.lastCard : classes.card
                }
              />
            );
          }}
        />
      );

    return (
      <View className={classes.emptyContainer}>
        <Icon name="cards-outline" size={65} color={getColor('gray-300')} />
        <Label className={classes.emptyNotificationText}>
          No portfolio items yet
        </Label>
      </View>
    );
  }, [filteredList]);

  return (
    <>
      <Select
        name="filter"
        required
        value={filter}
        onChange={({ value }) => setFilter(value)}
        options={portfolioFilters}
        inputClassName={classes.filterInput}
      />
      {_renderContent}
    </>
  );
}

const classes = {
  emptyContainer: 'flex-1 items-center mt-24',
  contentContainer: '!p-4.5 !gap-4.5',
  columnWrapper: '!gap-4.5',
  lastCard: 'flex-[0.5] mr-6',
  card: 'flex-1',
  filterInput: 'w-44 mx-4.5 mt-4.5',
  emptyNotificationText: '!text-lg mt-5 text-slate-400',
};
