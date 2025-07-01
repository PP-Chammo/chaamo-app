import { useCallback, useState } from 'react';

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
  RecentlyAdded,
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

  return (
    <ScreenContainer classNameTop={classes.containerTop}>
      <View className={classes.headerContainer}>
        <AccountBar />
        <Row className={classes.headerRow}>
          <SearchField value={searchText} onChange={handleChange} />
          <ButtonIcon
            name="heart"
            iconVariant="SimpleLineIcons"
            onPress={() => {}}
            count="5+"
          />
        </Row>
      </View>

      <ScrollView contentContainerClassName="gap-5">
        <CategoryList />
        <FeaturedList />
        <AuctionList />
        <PeopleList />
        <RecentlyAdded />
      </ScrollView>
    </ScreenContainer>
  );
}

const classes = {
  containerTop: '!bg-white',
  headerContainer: 'bg-white gap-3 py-5 border-b border-gray-100',
  headerRow: 'px-5',
};
