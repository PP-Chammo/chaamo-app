import { useCallback, useMemo } from 'react';

import { router } from 'expo-router';
import { cssInterop } from 'nativewind';
import { FlatList, View } from 'react-native';

import { Icon, Label } from '@/components/atoms';
import { CommonCard } from '@/components/molecules';
import {
  ListingType,
  useGetVwChaamoListingsQuery,
  useInsertFavoritesMutation,
  useRemoveFavoritesMutation,
} from '@/generated/graphql';
import { useCurrencyDisplay } from '@/hooks/useCurrencyDisplay';
import { useUserVar } from '@/hooks/useUserVar';
import { getColor } from '@/utils/getColor';

cssInterop(FlatList, {
  contentContainerClassName: { target: 'contentContainerStyle' },
});

export default function Portfolio() {
  const [user] = useUserVar();

  const { formatDisplay } = useCurrencyDisplay();

  const { data, refetch } = useGetVwChaamoListingsQuery({
    fetchPolicy: 'cache-and-network',
    variables: {
      filter: {
        seller_id: { eq: user?.id },
        listing_type: { eq: ListingType.PORTFOLIO },
      },
    },
  });
  const [insertFavorites] = useInsertFavoritesMutation();
  const [removeFavorites] = useRemoveFavoritesMutation();

  const portfolios = useMemo(
    () =>
      data?.vw_chaamo_cardsCollection?.edges?.filter(
        (card) => card?.node?.listing_type === ListingType.PORTFOLIO,
      ),
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
        insertFavorites({
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
    [insertFavorites, user?.id, refetch, removeFavorites],
  );

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
    <FlatList
      testID="portfolio-profile-list"
      data={portfolios}
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
              marketPrice={formatDisplay(item.node.currency, 0)}
              indicator="up"
              onPress={() =>
                router.push({
                  pathname: '/screens/common-detail',
                  params: {
                    id: item.node.id,
                    isFavorite: String(item.node.is_favorite),
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
