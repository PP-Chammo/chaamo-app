import React, { memo, useCallback, useMemo } from 'react';

import { router } from 'expo-router';

import { ListContainer, ListingCard } from '@/components/molecules';
import {
  GetVwFeaturedListingsQuery,
  ListingType,
  useGetVwFeaturedListingsQuery,
  useCreateFavoritesMutation,
  useRemoveFavoritesMutation,
} from '@/generated/graphql';
import { useCurrencyDisplay } from '@/hooks/useCurrencyDisplay';
import { useFavorites } from '@/hooks/useFavorites';
import { useUserVar } from '@/hooks/useUserVar';
import { DeepGet } from '@/types/helper';
import { getColor } from '@/utils/getColor';

const FeaturedList = memo(function FeaturedList() {
  const [user] = useUserVar();
  const { getIsFavorite } = useFavorites();
  const { formatDisplay } = useCurrencyDisplay();

  const { data, loading } = useGetVwFeaturedListingsQuery({
    fetchPolicy: 'cache-and-network',
    variables: {
      filter: {
        or: [
          { listing_type: { eq: ListingType.SELL } },
          { listing_type: { eq: ListingType.AUCTION } },
        ],
      },
      last: 10,
    },
  });

  const [createFavorites] = useCreateFavoritesMutation();
  const [removeFavorites] = useRemoveFavoritesMutation();

  const cards = useMemo(
    () => data?.vw_featured_cardsCollection?.edges ?? [],
    [data?.vw_featured_cardsCollection?.edges],
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

  if (loading || cards.length === 0) {
    return null;
  }

  return (
    <ListContainer<
      DeepGet<
        GetVwFeaturedListingsQuery,
        ['vw_featured_cardsCollection', 'edges', number]
      >
    >
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
          price={formatDisplay(
            card.node?.currency,
            card.node?.start_price ?? card.node?.price,
          )}
          marketPrice={formatDisplay(card.node?.currency, 0)}
          indicator="up"
          onPress={() =>
            router.push({
              pathname:
                card.node.listing_type === ListingType.AUCTION
                  ? '/screens/auction-detail'
                  : '/screens/common-detail',
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
