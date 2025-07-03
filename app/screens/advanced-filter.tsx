import { router } from 'expo-router';
import { View } from 'react-native';

import { ScreenContainer } from '@/components/atoms';
import {
  FilterAdPropertiesInput,
  FilterConditionInput,
  FilterLocationInput,
  FilterPriceRangeInput,
  FilterTags,
  Header,
} from '@/components/molecules';
import { useSearchStore } from '@/hooks/useSearchStore';

export default function AdvancedFilterScreen() {
  const { condition, location, priceRange, adProperties, setSearch } =
    useSearchStore();

  return (
    <ScreenContainer classNameTop={classes.containerTop}>
      <Header
        title="Refine Your Search"
        onBackPress={() => router.back()}
        className={classes.header}
      />
      <FilterTags />
      <View className={classes.fitlerContainer}>
        <FilterLocationInput value={location} onChange={setSearch} />
        <FilterPriceRangeInput value={priceRange} onChange={setSearch} />
        <FilterConditionInput value={condition} onChange={setSearch} />
        <FilterAdPropertiesInput value={adProperties} onChange={setSearch} />
      </View>
    </ScreenContainer>
  );
}

const classes = {
  containerTop: 'bg-white',
  header: 'bg-white px-5',
  fitlerContainer: 'flex flex-col gap-8 px-5 py-3 border-t border-gray-200',
};
