import { useCallback, useMemo, useState } from 'react';

import { router, useFocusEffect } from 'expo-router';
import { cssInterop } from 'nativewind';
import { ScrollView, View } from 'react-native';

import { Row, ScreenContainer, SearchField } from '@/components/atoms';
import { ButtonIcon } from '@/components/molecules';
import {
  AccountBar,
  AuctionList,
  CategoryList,
  FeaturedList,
  PeopleList,
  RecentlyAddedList,
} from '@/components/organisms';
import { TextChangeParams } from '@/domains';
import { useGetFavoritesQuery } from '@/generated/graphql';
import { useUserVar } from '@/hooks/useUserVar';

cssInterop(ScrollView, {
  contentContainerClassName: {
    target: 'contentContainerStyle',
  },
});

export default function HomeScreen() {
  const [user] = useUserVar();

  const { data: favoritesData, refetch: refetchFavorites } =
    useGetFavoritesQuery({
      skip: !user?.id,
      variables: {
        filter: {
          user_id: { eq: user?.id },
        },
      },
      onError: console.log,
    });

  const [searchText, setSearchText] = useState<string>('');

  const favorites = useMemo(
    () => favoritesData?.favorite_listingsCollection?.edges ?? [],
    [favoritesData?.favorite_listingsCollection?.edges],
  );

  const favoriteCount = useMemo(() => {
    if (favorites?.length > 0) {
      return favorites?.length > 9 ? '9+' : favorites?.length;
    }
  }, [favorites?.length]);

  const handleChange = useCallback(
    () =>
      ({ value }: TextChangeParams) =>
        setSearchText(value),
    [],
  );

  const handlePressSearch = useCallback(() => {
    router.push({
      pathname: '/screens/search',
      params: { focus: 'true', search: searchText },
    });
  }, [searchText]);

  useFocusEffect(
    useCallback(() => {
      refetchFavorites();
    }, [refetchFavorites]),
  );

  return (
    <ScreenContainer classNameTop={classes.containerTop}>
      <View className={classes.headerContainer}>
        <AccountBar />
        <Row className={classes.headerRow}>
          <SearchField
            editable={false}
            value={searchText}
            onChange={handleChange}
            onPress={handlePressSearch}
          />
          <ButtonIcon
            name="heart"
            iconVariant="SimpleLineIcons"
            onPress={() => router.push('/screens/wishlist')}
            count={favoriteCount}
          />
        </Row>
      </View>

      <ScrollView
        contentContainerClassName={classes.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <CategoryList />
        <FeaturedList
          favoriteList={favorites}
          refreshFavoriteCount={refetchFavorites}
        />
        <AuctionList
          favoriteList={favorites}
          refreshFavoriteCount={refetchFavorites}
        />
        <PeopleList />
        <RecentlyAddedList
          favoriteList={favorites}
          refreshFavoriteCount={refetchFavorites}
        />
      </ScrollView>
    </ScreenContainer>
  );
}

const classes = {
  containerTop: 'bg-white',
  headerContainer: 'bg-white gap-3 pt-3 pb-4.5 border-b border-gray-100',
  headerRow: 'px-5',
  contentContainer: 'py-4.5 gap-5',
  auctionList: 'bg-white py-4.5',
};
