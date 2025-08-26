import { memo, useMemo, useState } from 'react';

import { FlatList, View } from 'react-native';

import { EmptyOrders } from '@/assets/svg';
import { FilterTabs, FilterValue, Label, Loading } from '@/components/atoms';
import { OrderItem } from '@/components/molecules';
import { ORDER_TABS_FILTER } from '@/constants/tabs';
import {
  ListingType,
  OrderByDirection,
  OrderStatus,
  useGetVwMyOrdersQuery,
} from '@/generated/graphql';
import { useCurrencyDisplay } from '@/hooks/useCurrencyDisplay';
import { useUserVar } from '@/hooks/useUserVar';

const BoughtOrder = memo(function BoughtOrder() {
  const [user] = useUserVar();
  const { formatDisplay } = useCurrencyDisplay();

  const [selectedFilter, setSelectedFilter] = useState<FilterValue>('progress');

  const { data, loading } = useGetVwMyOrdersQuery({
    fetchPolicy: 'cache-and-network',
    variables: {
      filter: {
        buyer_id: { eq: user?.id },
      },
      orderBy: {
        created_at: OrderByDirection.DESCNULLSLAST,
      },
    },
  });

  const orders = useMemo(
    () => data?.vw_myordersCollection?.edges ?? [],
    [data?.vw_myordersCollection?.edges],
  );

  const filteredOrders = useMemo(() => {
    const statusMap = {
      progress: [
        OrderStatus.AWAITING_PAYMENT,
        OrderStatus.AWAITING_SHIPMENT,
        OrderStatus.SHIPPED,
        OrderStatus.REFUND_REQUESTED,
      ],
      completed: [OrderStatus.DELIVERED, OrderStatus.COMPLETED],
      cancelled: [OrderStatus.REFUNDED, OrderStatus.CANCELLED],
    };
    return (
      data?.vw_myordersCollection?.edges?.filter((item) => {
        return (
          statusMap[selectedFilter as keyof typeof statusMap].includes(
            item.node?.status ?? OrderStatus.AWAITING_PAYMENT,
          ) || false
        );
      }) ?? []
    );
  }, [data?.vw_myordersCollection?.edges, selectedFilter]);

  const _renderOrders = useMemo(() => {
    if (orders.length) {
      return (
        <FlatList
          data={filteredOrders}
          contentContainerClassName={classes.content}
          keyExtractor={(item) => item.node.id}
          renderItem={({ item }) => (
            <OrderItem
              id={item.node.id}
              listingId={item.node?.listing_id ?? ''}
              listingType={item.node?.listing_type ?? ListingType.SELL}
              title={item.node?.name ?? ''}
              price={formatDisplay(
                item.node?.currency,
                item.node?.final_price ?? 0,
              )}
              imageUrls={item.node?.image_urls ?? ''}
              status={item.node?.status ?? OrderStatus.AWAITING_SHIPMENT}
            />
          )}
        />
      );
    }

    return (
      <View className={classes.emptyOrders}>
        <EmptyOrders />
        <Label className={classes.emptyOrdersTitle}>No Orders Yet</Label>
        <Label className={classes.emptyOrdersDescription}>
          when you sell something it will be listed here.
        </Label>
      </View>
    );
  }, [filteredOrders, formatDisplay, orders.length]);
  return (
    <View className={classes.container}>
      <View>
        <FilterTabs
          tabs={ORDER_TABS_FILTER}
          className={classes.tabs}
          selected={selectedFilter}
          onChange={setSelectedFilter}
        />
      </View>
      {loading ? <Loading /> : _renderOrders}
    </View>
  );
});

const classes = {
  container: 'flex-1 px-4.5',
  content: 'flex-1 mt-5',
  tabs: 'mt-4.5',
  emptyOrders: 'items-center mt-24',
  emptyOrdersTitle: '!text-2xl font-bold text-primary-500',
  emptyOrdersDescription: 'text-sm text-gray-500 mt-2 w-56 text-center',
};

export default BoughtOrder;
