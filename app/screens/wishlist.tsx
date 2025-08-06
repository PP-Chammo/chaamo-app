import React, { useCallback, useMemo } from 'react';

import { router } from 'expo-router';
import { FlatList, View } from 'react-native';

import { Label, ScreenContainer } from '@/components/atoms';
import { CardItem, Header } from '@/components/molecules';
import {
  ListingType,
  useGetVwMyFavoriteListingsQuery,
  useRemoveFavoritesMutation,
} from '@/generated/graphql';
import { useCurrencyDisplay } from '@/hooks/useCurrencyDisplay';
import { useUserVar } from '@/hooks/useUserVar';
import { getColor } from '@/utils/getColor';

export default function WishlistScreen() {
  const [user] = useUserVar();
  const { formatDisplay } = useCurrencyDisplay();

  const { data, refetch } = useGetVwMyFavoriteListingsQuery({
    fetchPolicy: 'cache-and-network',
    skip: !user?.id,
  });
  const [removeFavorites] = useRemoveFavoritesMutation();

  const favorites = useMemo(
    () => data?.vw_myfavorite_listingsCollection?.edges ?? [],
    [data?.vw_myfavorite_listingsCollection?.edges],
  );

  const handleRemoveFavorite = useCallback(
    (listingId: string) => () => {
      removeFavorites({
        variables: {
          filter: {
            user_id: { eq: user?.id },
            listing_id: { eq: listingId },
          },
        },
        onCompleted: () => {
          refetch();
        },
      });
    },
    [refetch, removeFavorites, user?.id],
  );

  const handlePress = useCallback(
    (listingId: string, listingType: ListingType) => () => {
      if (listingType === ListingType.AUCTION) {
        return router.push({
          pathname: '/screens/auction-detail',
          params: {
            id: listingId,
            isFavorite: 'true',
          },
        });
      }
      return router.push({
        pathname: '/screens/common-detail',
        params: {
          id: listingId,
          isFavorite: 'true',
        },
      });
    },
    [],
  );

  return (
    <ScreenContainer enableBottomSafeArea={false}>
      <Header title="Wishlist" onBackPress={() => router.back()} />
      <View className={classes.container}>
        <Label variant="title" className={classes.title}>
          {favorites.length} saved items
        </Label>
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.node.id}
          contentContainerClassName={classes.contentContainer}
          renderItem={({ item }) => (
            <CardItem
              listingType={item.node?.listing_type ?? ListingType.SELL}
              imageUrl={item.node?.image_url ?? ''}
              title={item.node?.name ?? ''}
              subtitle={item.node?.seller_username ?? ''}
              price={formatDisplay(
                item.node?.currency,
                item.node?.listing_type === ListingType.AUCTION
                  ? (item.node?.start_price ?? 0)
                  : (item.node?.price ?? 0),
              )}
              date={item.node?.created_at ?? ''}
              marketType="eBay"
              marketPrice={formatDisplay(item.node?.currency, 0)}
              indicator="up"
              rightIcon="heart"
              rightIconColor={getColor('red-500')}
              rightIconSize={18}
              onRightIconPress={handleRemoveFavorite(item.node?.id)}
              onPress={handlePress(
                item.node?.id,
                item.node?.listing_type ?? ListingType.SELL,
              )}
            />
          )}
        />
      </View>
    </ScreenContainer>
  );
}

const classes = {
  contentContainer: 'gap-6',
  container: 'p-4.5',
  title: 'text-slate-800 !text-sm my-4.5',
};
