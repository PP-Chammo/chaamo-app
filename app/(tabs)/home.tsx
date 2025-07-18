import { useCallback, useState } from 'react';

import { router } from 'expo-router';
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

cssInterop(ScrollView, {
  contentContainerClassName: {
    target: 'contentContainerStyle',
  },
});

export default function HomeScreen() {
  const [searchText, setSearchText] = useState<string>('');

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
            count="5+"
          />
        </Row>
      </View>

      <ScrollView
        contentContainerClassName={classes.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <CategoryList />
        <FeaturedList />
        <AuctionList />
        <PeopleList />
        <RecentlyAddedList />
      </ScrollView>
    </ScreenContainer>
  );
}

const classes = {
  containerTop: '!bg-white',
  headerContainer: 'bg-white gap-3 py-5 border-b border-gray-100',
  headerRow: 'px-5',
  contentContainer: 'py-4.5 gap-5',
  auctionList: 'bg-white py-4.5',
};
