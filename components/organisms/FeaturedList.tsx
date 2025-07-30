import React, { memo, useCallback } from 'react';

import { router } from 'expo-router';

import { AuctionCard, CommonCard, ListContainer } from '@/components/molecules';
import {
  GetFavoritesQuery,
  GetFeaturedListingsQuery,
  ListingType,
  useGetFeaturedListingsQuery,
  useInsertFavoritesMutation,
  useRemoveFavoritesMutation,
  UserTier,
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
    fetchPolicy: 'cache-and-network',
    variables: {
      filter: {
        and: [
          { subscription_tier: { eq: UserTier.GOLD } },
          {
            or: [
              { listing_type: { eq: ListingType.SELL } },
              { listing_type: { eq: ListingType.AUCTION } },
            ],
          },
        ],
      },
      last: 10,
    },
  });
  const cards = data?.featured_cardsCollection?.edges ?? [];

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

  if (loading || cards.length === 0) {
    return null;
  }

  return (
    <ListContainer<
      DeepGet<
        GetFeaturedListingsQuery,
        ['featured_cardsCollection', 'edges', number]
      >
    >
      title="Featured"
      onViewAllHref="/screens/product-list"
      data={cards}
    >
      {(card) =>
        card.node.listing_type === ListingType.AUCTION ? (
          <AuctionCard
            key={card.node.id}
            id={card.node.id}
            imageUrl={card.node?.image_url ?? ''}
            title={card.node?.name ?? ''}
            price={`${card.node?.currency?.trim()}${card.node?.start_price?.trim()}`}
            rightIcon={getIsFavorite(card.node.id) ? 'heart' : 'heart-outline'}
            rightIconColor={
              getIsFavorite(card.node.id) ? getColor('red-600') : undefined
            }
            rightIconSize={18}
            onPress={() => router.push('/screens/auction-detail')}
            onRightIconPress={handleToggleFavorite(card.node.id)}
          />
        ) : (
          <CommonCard
            key={card.node.id}
            id={card.node.id}
            imageUrl={card.node?.image_url ?? ''}
            title={card.node?.name ?? ''}
            price={`${card.node?.currency?.trim()}${card.node?.price?.trim()}`}
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
        )
      }
    </ListContainer>
  );
});

export default FeaturedList;
