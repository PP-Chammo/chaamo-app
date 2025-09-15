import React, { useCallback, useMemo } from 'react';

import { router, useFocusEffect } from 'expo-router';
import { FlatList, View } from 'react-native';

import { Label, ScreenContainer } from '@/components/atoms';
import { ListingItem, Header } from '@/components/molecules';
import {
  ListingType,
  useGetVwMyFavoritesLazyQuery,
  useRemoveFavoritesMutation,
} from '@/generated/graphql';
import { useUserVar } from '@/hooks/useUserVar';
import { getColor } from '@/utils/getColor';
import { getIndicator } from '@/utils/getIndicator';

export default function WishlistScreen() {
  const [user] = useUserVar();

  const [getFavorites, { data, refetch }] = useGetVwMyFavoritesLazyQuery({
    fetchPolicy: 'cache-and-network',
  });
  const [removeFavorites] = useRemoveFavoritesMutation();

  const favorites = useMemo(
    () => data?.vw_myfavoritesCollection?.edges ?? [],
    [data?.vw_myfavoritesCollection?.edges],
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
    (listingId: string) => () => {
      router.push({
        pathname: '/screens/listing-detail',
        params: {
          id: listingId,
        },
      });
    },
    [],
  );

  useFocusEffect(
    useCallback(() => {
      getFavorites();
    }, [getFavorites]),
  );

  return (
    <ScreenContainer>
      <Header title="Wishlist" onBackPress={() => router.back()} />
      <View className={classes.container}>
        <Label variant="title" className={classes.title}>
          {favorites.length} saved items
        </Label>
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.node.id}
          showsVerticalScrollIndicator={false}
          contentContainerClassName={classes.contentContainer}
          renderItem={({ item }) => (
            <ListingItem
              listingType={item.node?.listing_type ?? ListingType.SELL}
              imageUrls={item.node?.image_urls ?? ''}
              title={item.node?.title ?? ''}
              subtitle={item.node?.seller_username ?? ''}
              date={item.node?.created_at ?? ''}
              currency={item.node?.currency}
              price={item.node?.start_price}
              highestBidCurrency={item.node?.highest_bid_currency}
              highestBidPrice={item.node?.highest_bid_price}
              marketCurrency={item.node?.last_sold_currency}
              marketPrice={item.node?.last_sold_price}
              lastSoldIsChecked={item.node?.last_sold_is_checked ?? false}
              lastSoldIsCorrect={item.node?.last_sold_is_correct ?? false}
              indicator={getIndicator(
                item.node?.start_price,
                item.node?.last_sold_price,
              )}
              rightIcon="heart"
              rightIconColor={getColor('red-500')}
              onRightIconPress={handleRemoveFavorite(item.node?.id)}
              onPress={handlePress(item.node?.id)}
            />
          )}
        />
      </View>
    </ScreenContainer>
  );
}

const classes = {
  container: 'flex-1 p-4.5',
  contentContainer: 'gap-6',
  title: 'text-slate-800 !text-sm my-4.5',
};
