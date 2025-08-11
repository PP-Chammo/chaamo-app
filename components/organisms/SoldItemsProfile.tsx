import { useCallback, useMemo } from 'react';

import { router } from 'expo-router';
import { cssInterop } from 'nativewind';
import { FlatList, View } from 'react-native';

import { Boost, Icon, Label } from '@/components/atoms';
import { CommonCard } from '@/components/molecules';
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

  const { data, refetch } = useGetVwChaamoListingsQuery({
    fetchPolicy: 'cache-and-network',
    variables: {
      filter: {
        seller_id: { eq: user?.id },
        listing_type: { neq: ListingType.PORTFOLIO },
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
    <FlatList
      testID="sold-items-profile-list"
      data={soldItems}
      keyExtractor={(item) => item.node.id.toString()}
      numColumns={2}
      horizontal={false}
      showsVerticalScrollIndicator={false}
      contentContainerClassName={classes.contentContainer}
      renderItem={({ item }) => {
        return (
          <View className={classes.cardContainer}>
            <CommonCard
              id={item.node.id}
              imageUrl={item.node.image_url ?? ''}
              title={item.node.name ?? ''}
              marketType="eBay"
              marketPrice={formatDisplay(item.node.currency, item.node.price)}
              indicator="up"
              onPress={() =>
                router.push({
                  pathname: '/screens/common-detail',
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
              rightComponent={<Boost boosted={item.node.is_boosted ?? false} />}
            />
          </View>
        );
      }}
    />
  );
}

const classes = {
  emptyContainer: 'flex-1 items-center mt-24',
  contentContainer: 'py-4.5 gap-10',
  cardContainer: 'flex-1 items-center justify-center',
  emptyNotificationText: '!text-lg mt-5 text-slate-400',
};
