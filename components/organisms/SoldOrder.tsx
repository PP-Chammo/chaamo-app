import { memo, useState } from 'react';

import { View } from 'react-native';

import { EmptyOrders } from '@/assets/svg';
import { FilterTabs, Label } from '@/components/atoms';
import { SOLD_TABS_FILTER } from '@/constants/tabs';

const SoldOrder = memo(function SoldOrder() {
  const [selectedFilter, setSelectedFilter] = useState<string>('progress');
  return (
    <View className={classes.container}>
      <FilterTabs
        tabs={SOLD_TABS_FILTER}
        className={classes.tabs}
        selected={selectedFilter}
        onChange={(value) => setSelectedFilter(value as string)}
      />
      <View className={classes.emptyOrders}>
        <EmptyOrders />
        <Label className={classes.emptyOrdersTitle}>No Orders Yet</Label>
        <Label className={classes.emptyOrdersDescription}>
          when you sell something it will be listed here.
        </Label>
      </View>
    </View>
  );
});

const classes = {
  container: 'px-4.5',
  tabs: 'mt-4.5',
  emptyOrders: 'items-center mt-24',
  emptyOrdersTitle: '!text-2xl font-bold text-teal-600',
  emptyOrdersDescription: 'text-sm text-gray-500 mt-2 w-56 text-center',
};

export default SoldOrder;
