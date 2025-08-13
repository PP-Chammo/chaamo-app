import { useMemo, useState } from 'react';

import { router, useLocalSearchParams } from 'expo-router';
import { cssInterop } from 'nativewind';
import { FlatList, View } from 'react-native';

import { Boost, Button, Icon, Label, Row } from '@/components/atoms';
import { ListingCard } from '@/components/molecules';
import { listingTypes } from '@/constants/listingTypes';
import {
  ListingStatus,
  ListingType,
  OrderByDirection,
  useGetVwChaamoListingsQuery,
} from '@/generated/graphql';
import { useCurrencyDisplay } from '@/hooks/useCurrencyDisplay';
import { useUserVar } from '@/hooks/useUserVar';
import { getColor } from '@/utils/getColor';

cssInterop(FlatList, {
  contentContainerClassName: { target: 'contentContainerStyle' },
});

export default function Portfolio() {
  const [user] = useUserVar();
  const { userId } = useLocalSearchParams();
  const { formatDisplay } = useCurrencyDisplay();

  const [filter, setFilter] = useState<ListingType | 'all'>('all');

  const { data } = useGetVwChaamoListingsQuery({
    skip: !userId && !user?.id,
    fetchPolicy: 'cache-and-network',
    variables: {
      filter: {
        seller_id: { eq: userId ?? user?.id },
        status: { neq: ListingStatus.SOLD },
      },
      orderBy: {
        created_at: OrderByDirection.DESCNULLSLAST,
      },
    },
  });

  const portfolios = useMemo(
    () => data?.vw_chaamo_cardsCollection?.edges ?? [],
    [data?.vw_chaamo_cardsCollection?.edges],
  );

  const filteredPortfolios = useMemo(() => {
    if (filter === 'all') {
      return portfolios;
    }
    return portfolios.filter((edge) => edge.node.listing_type === filter);
  }, [portfolios, filter]);

  if (!portfolios?.length) {
    return (
      <View className={classes.emptyContainer}>
        <Icon name="cards-outline" size={65} color={getColor('gray-300')} />
        <Label className={classes.emptyNotificationText}>
          No portfolio items yet
        </Label>
      </View>
    );
  }

  return (
    <View className={classes.container}>
      <Row center className={classes.filterContainer}>
        {listingTypes.map((listingType) => (
          <Button
            key={listingType.value}
            size="small"
            variant={filter === listingType.value ? 'primary' : 'secondary'}
            onPress={() => setFilter(listingType.value)}
          >
            {listingType.label}
          </Button>
        ))}
      </Row>
      <FlatList
        testID="portfolio-profile-list"
        data={filteredPortfolios}
        keyExtractor={(item) => item.node.id.toString()}
        numColumns={2}
        horizontal={false}
        showsVerticalScrollIndicator={false}
        contentContainerClassName={classes.contentContainer}
        renderItem={({ item }) => (
          <View className={classes.cardContainer}>
            <ListingCard
              type={item.node.listing_type}
              id={item.node.id}
              imageUrl={item.node.image_url ?? ''}
              title={item.node.name ?? ''}
              price={formatDisplay(
                item.node.currency,
                item.node?.start_price ?? 0,
              )}
              marketPrice={formatDisplay(item.node.currency, 0)}
              indicator="up"
              onPress={() =>
                router.push({
                  pathname:
                    item.node.listing_type === ListingType.AUCTION
                      ? '/screens/auction-detail'
                      : '/screens/common-detail',
                  params: {
                    id: item.node.id,
                  },
                })
              }
              rightComponent={<Boost boosted={item.node.is_boosted ?? false} />}
            />
          </View>
        )}
      />
    </View>
  );
}

const classes = {
  container: 'flex-1',
  emptyContainer: 'flex-1 items-center mt-24',
  contentContainer: 'pb-4.5 gap-10',
  cardContainer: 'flex-[0.5] items-center',
  filterContainer: 'px-4.5 py-4 gap-2',
  emptyNotificationText: '!text-lg mt-5 text-slate-400',
};
