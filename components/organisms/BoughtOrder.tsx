import { memo, useMemo, useState } from 'react';

import { FlatList, View } from 'react-native';

import { EmptyOrders } from '@/assets/svg';
import { FilterTabs, FilterValue, Label } from '@/components/atoms';
import { OrderItem, type OrderStatus } from '@/components/molecules';
import { dummyOrders } from '@/constants/dummy';
import { ORDER_TABS_FILTER } from '@/constants/tabs';

const BoughtOrder = memo(function BoughtOrder() {
  const [selectedFilter, setSelectedFilter] = useState<FilterValue>('progress');

  const _renderOrders = useMemo(() => {
    const _DATA = dummyOrders.filter((item) => item.status === selectedFilter);

    if (_DATA.length)
      return (
        <FlatList
          data={_DATA}
          contentContainerClassName={classes.content}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <OrderItem {...item} status={item.status as OrderStatus} />
          )}
        />
      );

    return (
      <View className={classes.emptyOrders}>
        <EmptyOrders />
        <Label className={classes.emptyOrdersTitle}>No Orders Yet</Label>
        <Label className={classes.emptyOrdersDescription}>
          when you sell something it will be listed here.
        </Label>
      </View>
    );
  }, [selectedFilter]);
  return (
    <View className={classes.container}>
      <FilterTabs
        tabs={ORDER_TABS_FILTER}
        className={classes.tabs}
        selected={selectedFilter}
        onChange={setSelectedFilter}
      />
      {_renderOrders}
    </View>
  );
});

const classes = {
  container: 'px-4.5',
  content: 'mt-10',
  tabs: 'mt-4.5',
  emptyOrders: 'items-center mt-24',
  emptyOrdersTitle: '!text-2xl font-bold text-teal-600',
  emptyOrdersDescription: 'text-sm text-gray-500 mt-2 w-56 text-center',
};

export default BoughtOrder;
