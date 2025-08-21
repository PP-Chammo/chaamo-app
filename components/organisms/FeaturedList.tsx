import React, { memo, useCallback, useMemo } from 'react';

import { router, useFocusEffect } from 'expo-router';

import { ListContainer, ListingCard } from '@/components/molecules';
import {
  ListingType,
  useCreateFavoritesMutation,
  useRemoveFavoritesMutation,
  useGetVwChaamoListingsLazyQuery,
} from '@/generated/graphql';
import { useFavorites } from '@/hooks/useFavorites';
import { useUserVar } from '@/hooks/useUserVar';
import { getColor } from '@/utils/getColor';
import { getIndicator } from '@/utils/getIndicator';

const FeaturedList = memo(function FeaturedList() {
  const [user] = useUserVar();
  const { getIsFavorite } = useFavorites();

  const [getFeaturedListings, { data, loading }] =
    useGetVwChaamoListingsLazyQuery({
      fetchPolicy: 'cache-and-network',
    });

  const [createFavorites] = useCreateFavoritesMutation();
  const [removeFavorites] = useRemoveFavoritesMutation();

  const cards = useMemo(
    () => data?.vw_chaamo_cardsCollection?.edges ?? [],
    [data?.vw_chaamo_cardsCollection?.edges],
  );

  const handleToggleFavorite = useCallback(
    (listing_id: string) => () => {
      if (getIsFavorite(listing_id)) {
        removeFavorites({
          variables: {
            filter: {
              user_id: { eq: user?.id },
              listing_id: { eq: listing_id },
            },
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
        });
      }
    },
    [getIsFavorite, createFavorites, user?.id, removeFavorites],
  );

  useFocusEffect(
    useCallback(() => {
      if (user?.id) {
        getFeaturedListings({
          variables: {
            filter: {
              or: [
                { listing_type: { eq: ListingType.SELL } },
                { listing_type: { eq: ListingType.AUCTION } },
              ],
              is_boosted: { eq: true },
            },
            last: 10,
          },
        });
      }
    }, [getFeaturedListings, user?.id]),
  );

  if (loading || cards.length === 0) {
    return null;
  }

  return (
    <ListContainer
      title="Featured"
      onViewAllHref="/screens/product-list"
      data={cards}
    >
      {(card) => (
        <ListingCard
          key={card.node.id}
          type={card.node.listing_type}
          id={card.node.id}
          imageUrl={card.node?.image_url ?? ''}
          title={card.node?.name ?? ''}
          currency={card.node?.currency}
          price={card.node?.start_price}
          marketCurrency={card.node?.last_sold_currency}
          marketPrice={card.node?.last_sold_price}
          lastSoldIsChecked={card.node?.last_sold_is_checked ?? false}
          lastSoldIsCorrect={card.node?.last_sold_is_correct ?? false}
          indicator={getIndicator(
            card.node?.start_price,
            card.node?.last_sold_price,
          )}
          onPress={() =>
            router.push({
              pathname: '/screens/listing-detail',
              params: {
                id: card.node.id,
              },
            })
          }
          rightIcon={getIsFavorite(card.node.id) ? 'heart' : 'heart-outline'}
          rightIconColor={
            getIsFavorite(card.node.id) ? getColor('red-600') : undefined
          }
          rightIconSize={18}
          onRightIconPress={handleToggleFavorite(card.node.id)}
        />
      )}
    </ListContainer>
  );
});

export default FeaturedList;
