import { useCallback } from 'react';

import { router, useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';

import { ScreenContainer } from '@/components/atoms';
import { FilterSection, HeaderSearch, TabView } from '@/components/molecules';
import {
  ProductAuctionList,
  ProductCardList,
  ProductFixedList,
} from '@/components/organisms';
import { dummyAuctionCardList } from '@/constants/dummy';
import { productListTabs } from '@/constants/tabs';
import { TextChangeParams } from '@/domains';
import { useSearchVar } from '@/hooks/useSearchVar';

export default function ProductListScreen() {
  const params = useLocalSearchParams();
  const [searchVar, setSearchVar] = useSearchVar();

  const handleChange = useCallback(
    ({ value }: TextChangeParams) => setSearchVar({ query: value.trim() }),
    [setSearchVar],
  );

  return (
    <ScreenContainer classNameTop={classes.containerTop}>
      <HeaderSearch
        value={searchVar.query}
        onChange={handleChange}
        onBackPress={() => router.back()}
      />
      <FilterSection
        resultCount={dummyAuctionCardList.length}
        query={(params?.category ?? params?.search) as string}
      />
      <View className={classes.tabViewContainer}>
        <TabView className={classes.tabView} tabs={productListTabs}>
          <ProductCardList />
          <ProductAuctionList />
          <ProductFixedList />
        </TabView>
      </View>
    </ScreenContainer>
  );
}

const classes = {
  containerTop: 'bg-white',
  tabView: 'mt-2 mx-4.5',
  tabViewContainer: 'flex-1',
};
