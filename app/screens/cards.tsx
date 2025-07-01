import { useCallback, useState } from 'react';

import { router, useLocalSearchParams } from 'expo-router';
import { FlatList } from 'react-native';

import { Row, ScreenContainer, SearchField } from '@/components/atoms';
import { ButtonIcon, CardInfo, FilterSection } from '@/components/molecules';
import { dummyAuctionCardList, dummyFeaturedCardList } from '@/constants/dummy';
import { TextChangeParams } from '@/domains';
import { getColor } from '@/utils/getColor';

export default function CardsScreen() {
  const query = useLocalSearchParams();

  const [searchText, setSearchText] = useState('');

  const handleChange = useCallback(
    () =>
      ({ value }: TextChangeParams) =>
        setSearchText(value),
    [],
  );

  return (
    <ScreenContainer classNameTop={classes.containerTop}>
      <Row className={classes.headerContainer}>
        <ButtonIcon
          name="arrow-left"
          onPress={() => router.back()}
          iconSize={24}
          color={getColor('teal-500')}
        />
        <SearchField value={searchText} onChange={handleChange} />
      </Row>
      <FilterSection
        resultCount={dummyAuctionCardList.length}
        category={query?.category as string}
      />
      <FlatList
        showsVerticalScrollIndicator={false}
        data={dummyFeaturedCardList}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CardInfo
            imageUrl={item.imageUrl}
            title={item.title}
            bidPrice={item.bidPrice}
            currentPrice={item.currentPrice}
            indicator={item.indicator}
            onFavoritePress={() => console.log('Favorite pressed')}
          />
        )}
        contentContainerClassName={classes.contentContainer}
      />
    </ScreenContainer>
  );
}

const classes = {
  containerTop: 'bg-white',
  headerContainer: 'bg-white pl-2 pr-5 py-5',
  filterContainer: 'px-5 py-3',
  filterButton: '!px-4 !py-2',
  filterTextContainer: 'px-5 py-3 !gap-1',
  filterPlaceholder: 'font-light text-gray-500',
  resultText: 'font-semibold',
  contentContainer: 'gap-3',
};
