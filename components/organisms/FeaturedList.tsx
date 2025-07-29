import React, { memo, useCallback } from 'react';

import { CommonCard, ListContainer } from '@/components/molecules';
import {
  GetFavoritesQuery,
  GetFeaturedListingsQuery,
  ListingType,
  useGetFeaturedListingsQuery,
  useInsertFavoritesMutation,
  useRemoveFavoritesMutation,
} from '@/generated/graphql';
import { useProfileVar } from '@/hooks/useProfileVar';
import { DeepGet } from '@/types/helper';
import { getColor } from '@/utils/getColor';

type FeaturedListProps = {
  favoriteList: DeepGet<
    GetFavoritesQuery,
    ['favorite_listingsCollection', 'edges']
  >;
  refreshFavoriteCount: () => void;
};

const FeaturedList: React.FC<FeaturedListProps> = memo(function FeaturedList({
  favoriteList = [],
  refreshFavoriteCount,
}) {
  const [profile] = useProfileVar();
  const { data, loading } = useGetFeaturedListingsQuery({
    variables: {
      filter: {
        or: [
          { listing_type: { eq: ListingType.SELL } },
          { listing_type: { eq: ListingType.EBAY } },
        ],
        price: { gte: '100.00' },
      },
      last: 10,
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
    <ListContainer<
      DeepGet<GetFeaturedListingsQuery, ['listingsCollection', 'edges', number]>
    >
      title="Featured"
      onViewAllHref="/screens/product-list"
      data={cards}
    >
      {(card) => (
        <CommonCard
          key={card.node.id}
          id={card.node.id}
          imageUrl={
            card.node.user_cards?.user_images ??
            card.node.ebay_posts?.image_url ??
            ''
          }
          title={
            card.node.user_cards?.master_cards?.name ??
            card.node.ebay_posts?.title ??
            ''
          }
          price={`${card.node.currency?.trim()}${card.node.price?.trim()}`}
          marketPrice={
            card?.node?.price
              ? `${card.node.currency?.trim()}${card.node.price?.trim()}`
              : ''
          }
          marketType={
            card.node.listing_type === ListingType.EBAY ? 'eBay' : 'chaamo'
          }
          indicator="up"
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
