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

const AuctionList = memo(function AuctionList() {
  const [user] = useUserVar();
  const { getIsFavorite } = useFavorites();

  const [getAuctionListings, { data, loading }] =
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
      getAuctionListings({
        variables: {
          filter: {
            listing_type: { eq: ListingType.AUCTION },
          },
          last: 10,
        },
      });
    }, [getAuctionListings]),
  );

  if (loading) {
    return null;
  }

  return (
    <ListContainer
      title="Auction"
      onViewAllHref="/screens/product-list"
      icon="access-point"
      iconColor={getColor('red-500')}
      className={classes.container}
      headerClassName={classes.headerContainer}
      data={cards}
    >
      {(card) => (
        <ListingCard
          key={card.node.id}
          id={card.node.id}
          type={card.node.listing_type}
          imageUrl={card.node?.image_url ?? ''}
          title={card.node?.name ?? ''}
          currency={card.node?.currency}
          price={card.node?.start_price}
          marketCurrency={card.node?.last_sold_currency}
          marketPrice={card.node?.last_sold_price}
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

const classes = {
  headerContainer: 'pt-5',
  container: 'bg-white',
};

export default AuctionList;
