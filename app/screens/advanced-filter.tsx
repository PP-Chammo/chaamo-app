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
import { useSearchVar } from '@/hooks/useSearchVar';

export default function AdvancedFilterScreen() {
  const [searchVar, setSearchVar] = useSearchVar();

  return (
    <ScreenContainer classNameTop={classes.containerTop}>
      <Header
        title="Refine Your Search"
        onBackPress={() => router.back()}
        className={classes.header}
      />
      <FilterTags />
      <View className={classes.fitlerContainer}>
        <FilterLocationInput
          value={searchVar.location}
          onChange={(value) => setSearchVar({ location: value })}
        />
        <FilterPriceRangeInput
          value={searchVar.priceRange}
          onChange={(value) => setSearchVar({ priceRange: value })}
        />
        <FilterConditionInput
          value={searchVar.condition}
          onChange={(value) => setSearchVar({ condition: value })}
        />
        <FilterAdPropertiesInput
          value={searchVar.adProperties}
          onChange={(value) => setSearchVar({ adProperties: value })}
        />
      </View>
    </ScreenContainer>
  );
}

const classes = {
  containerTop: 'bg-white',
  header: 'bg-white',
  fitlerContainer: 'flex flex-col gap-8 px-4.5 py-3 border-t border-gray-200',
};
