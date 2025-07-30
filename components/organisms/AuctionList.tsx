import React, { memo, useCallback } from 'react';

import { router } from 'expo-router';

import { AuctionCard, ListContainer } from '@/components/molecules';
import {
  GetFavoritesQuery,
  ListingType,
  useGetAuctionListingsQuery,
  useInsertFavoritesMutation,
  useRemoveFavoritesMutation,
} from '@/generated/graphql';
import { useProfileVar } from '@/hooks/useProfileVar';
import { DeepGet } from '@/types/helper';
import { getColor } from '@/utils/getColor';

type AuctionListProps = {
  favoriteList: DeepGet<
    GetFavoritesQuery,
    ['favorite_listingsCollection', 'edges']
  >;
  refreshFavoriteCount: () => void;
};

const AuctionList: React.FC<AuctionListProps> = memo(function AuctionList({
  favoriteList = [],
  refreshFavoriteCount,
}) {
  const [profile] = useProfileVar();
  const { data, loading } = useGetAuctionListingsQuery({
    fetchPolicy: 'cache-and-network',
    variables: {
      filter: {
        listing_type: { eq: ListingType.AUCTION },
      },
    },
  });
  const cards = data?.listingsCollection?.edges ?? [];

  const [insertFavorites] = useInsertFavoritesMutation();
  const [removeFavorites] = useRemoveFavoritesMutation();

  const getIsFavorite = useCallback(
    (listingId: string) =>
      favoriteList.some((edge) => edge.node.listing_id === listingId),
    [favoriteList],
  );

  const handleToggleFavorite = useCallback(
    (listing_id: string) => () => {
      if (getIsFavorite(listing_id)) {
        removeFavorites({
          variables: {
            filter: {
              user_id: { eq: profile?.id },
              listing_id: { eq: listing_id },
            },
          },
          onCompleted: () => {
            refreshFavoriteCount();
          },
        });
      } else {
        insertFavorites({
          variables: {
            objects: [
              {
                user_id: profile?.id,
                listing_id,
              },
            ],
          },
          onCompleted: () => {
            refreshFavoriteCount();
          },
        });
      }
    },
    [
      getIsFavorite,
      insertFavorites,
      profile?.id,
      refreshFavoriteCount,
      removeFavorites,
    ],
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
        <AuctionCard
          key={card.node.id}
          id={card.node.id}
          imageUrl={card.node.user_cards?.user_images ?? ''}
          title={card.node.user_cards?.master_cards?.name ?? ''}
          price={`${card.node.currency?.trim()}${card.node.start_price?.trim()}`}
          rightIcon={getIsFavorite(card.node.id) ? 'heart' : 'heart-outline'}
          rightIconColor={
            getIsFavorite(card.node.id) ? getColor('red-600') : undefined
          }
          rightIconSize={18}
          onPress={() => router.push('/screens/auction-detail')}
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
