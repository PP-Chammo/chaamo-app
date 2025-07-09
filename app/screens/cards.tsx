import { useCallback } from 'react';

import { router, useLocalSearchParams } from 'expo-router';
import { FlatList, View } from 'react-native';

import { Button, Icon, Label, ScreenContainer } from '@/components/atoms';
import { CardInfo, FilterSection, HeaderSearch } from '@/components/molecules';
import { dummyAuctionCardList, dummyFeaturedCardList } from '@/constants/dummy';
import { TextChangeParams } from '@/domains';
import { useSearchStore } from '@/hooks/useSearchStore';
import { getColor } from '@/utils/getColor';

export default function CardsScreen() {
  const params = useLocalSearchParams();
  const { setSearch, query } = useSearchStore();

  const handleChange = useCallback(
    ({ value }: TextChangeParams) => setSearch('query', value.trim()),
    [setSearch],
  );

  const handleCtaBack = useCallback(() => router.back(), []);

  return (
    <ScreenContainer classNameTop={classes.containerTop}>
      <HeaderSearch
        value={query}
        onChange={handleChange}
        onBackPress={handleCtaBack}
      />
      {dummyFeaturedCardList?.length > 0 ? (
        <>
          <FilterSection
            resultCount={dummyAuctionCardList.length}
            query={(params?.category ?? params?.search) as string}
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
        </>
      ) : (
        <View className={classes.notFoundContainer}>
          <Icon
            name="dizzy"
            variant="FontAwesome6"
            color={getColor('teal-500')}
            size={120}
            className={classes.notFoundIcon}
          />
          <Label>Uh-oh! We couldn`t find that</Label>
          <Button onPress={handleCtaBack} variant="primary-light">
            Lets try using different keywords
          </Button>
        </View>
      )}
    </ScreenContainer>
  );
}

const classes = {
  containerTop: 'bg-white',
  contentContainer: 'gap-3',
  notFoundContainer: 'flex flex-col items-center gap-5 pt-28',
  notFoundIcon: 'opacity-20',
};
