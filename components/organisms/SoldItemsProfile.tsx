import { useCallback, useMemo, useState } from 'react';

import { router } from 'expo-router';
import { cssInterop } from 'nativewind';
import { FlatList, View } from 'react-native';

import { Boost, Button, Icon, Label, Row } from '@/components/atoms';
import { ListingCard } from '@/components/molecules';
import { listingTypes } from '@/constants/listingTypes';
import {
  ListingStatus,
  ListingType,
  useGetVwChaamoListingsQuery,
  useCreateFavoritesMutation,
  useRemoveFavoritesMutation,
} from '@/generated/graphql';
import { useCurrencyDisplay } from '@/hooks/useCurrencyDisplay';
import { useUserVar } from '@/hooks/useUserVar';
import { getColor } from '@/utils/getColor';

cssInterop(FlatList, {
  contentContainerClassName: { target: 'contentContainerStyle' },
});

export default function SoldItems() {
  const [user] = useUserVar();
  const { formatDisplay } = useCurrencyDisplay();

  const [filter, setFilter] = useState<ListingType | 'all'>('all');

  const { data, refetch } = useGetVwChaamoListingsQuery({
    fetchPolicy: 'cache-and-network',
    variables: {
      filter: {
        seller_id: { eq: user?.id },
        status: { eq: ListingStatus.SOLD },
      },
    },
  });
  const [createFavorites] = useCreateFavoritesMutation();
  const [removeFavorites] = useRemoveFavoritesMutation();

  const soldItems = useMemo(
    () => data?.vw_chaamo_cardsCollection?.edges ?? [],
    [data?.vw_chaamo_cardsCollection?.edges],
  );

  const filteredSoldItems = useMemo(() => {
    if (filter === 'all') {
      return soldItems;
    }
    return soldItems.filter((edge) => edge.node.listing_type === filter);
  }, [soldItems, filter]);

  const handleToggleFavorite = useCallback(
    (listing_id: string, isFavorite: boolean) => () => {
      if (isFavorite) {
        removeFavorites({
          variables: {
            filter: {
              user_id: { eq: user?.id },
              listing_id: { eq: listing_id },
            },
          },
          onCompleted: () => {
            refetch();
          },
        });
      } else {
        createFavorites({
          variables: {
            objects: [
              {
                user_id: user?.id,
                listing_id,
              },
            ],
          },
          onCompleted: () => {
            refetch();
          },
        });
      }
    },
    [createFavorites, user?.id, refetch, removeFavorites],
  );

  if (!soldItems?.length) {
    return (
      <View className={classes.emptyContainer}>
        <Icon name="cards-outline" size={65} color={getColor('gray-300')} />
        <Label variant="subtitle" className={classes.emptyNotificationText}>
          No sold items yet
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
        testID="sold-items-profile-list"
        data={filteredSoldItems}
        keyExtractor={(item) => item.node.id.toString()}
        numColumns={2}
        horizontal={false}
        showsVerticalScrollIndicator={false}
        contentContainerClassName={classes.contentContainer}
        renderItem={({ item }) => {
          return (
            <View className={classes.cardContainer}>
              <ListingCard
                id={item.node.id}
                type={item.node.listing_type}
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
                onRightIconPress={handleToggleFavorite(
                  item.node.id,
                  item.node.is_favorite ?? false,
                )}
                rightIcon={item.node.is_favorite ? 'heart' : 'heart-outline'}
                rightIconColor={
                  item.node.is_favorite ? getColor('red-600') : undefined
                }
                rightIconSize={18}
                rightComponent={
                  <Boost boosted={item.node.is_boosted ?? false} />
                }
              />
            </View>
          );
        }}
      />
    </View>
  );
}

const classes = {
  container: 'flex-1',
  emptyContainer: 'flex-1 items-center mt-24',
  contentContainer: 'py-4.5 gap-10',
  cardContainer: 'flex-1 items-center justify-center',
  filterContainer: 'px-4.5 py-4 gap-2',
  emptyNotificationText: '!text-lg mt-5 text-slate-400',
};
