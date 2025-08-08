import React, { memo, useCallback, useMemo } from 'react';

import { router } from 'expo-router';

import { AuctionCard, CommonCard, ListContainer } from '@/components/molecules';
import {
  ListingType,
  useGetFavoritesQuery,
  useGetVwFeaturedListingsQuery,
} from '@/generated/graphql';
import { useCurrencyDisplay } from '@/hooks/useCurrencyDisplay';
import { useUserVar } from '@/hooks/useUserVar';
import { getColor } from '@/utils/getColor';

interface SimilarAdListProps {
  ignoreListingId: string;
  listingType: ListingType;
}

const SimilarAdList: React.FC<SimilarAdListProps> = memo(
  function SimilarAdList({ ignoreListingId, listingType }) {
    const [user] = useUserVar();
    const { formatDisplay } = useCurrencyDisplay();

    const { data: favoritesData } = useGetFavoritesQuery({
      skip: !user?.id,
      variables: {
        filter: {
          user_id: { eq: user?.id },
        },
      },
      onError: console.log,
    });
    const { data, loading } = useGetVwFeaturedListingsQuery({
      fetchPolicy: 'cache-and-network',
      variables: {
        filter: {
          and: [
            { id: { neq: ignoreListingId } },
            { listing_type: { eq: listingType } },
          ],
        },
        last: 10,
      },
    });

    const cards = useMemo(
      () => data?.vw_featured_cardsCollection?.edges ?? [],
      [data?.vw_featured_cardsCollection?.edges],
    );

    const getIsFavorite = useCallback(
      (listingId: string) =>
        favoritesData?.favorite_listingsCollection?.edges?.some(
          (edge) => edge.node.listing_id === listingId,
        ),
      [favoritesData?.favorite_listingsCollection?.edges],
    );

    if (loading || cards.length === 0) {
      return null;
    }

    return (
      <ListContainer noLink title="Similar Ads" data={cards}>
        {(card) =>
          card.node.listing_type === ListingType.AUCTION ? (
            <AuctionCard
              key={card.node.id}
              id={card.node.id}
              imageUrl={card.node?.image_url ?? ''}
              title={card.node?.name ?? ''}
              price={formatDisplay(card.node?.currency, card.node?.start_price)}
              rightIcon={
                getIsFavorite(card.node.id) ? 'heart' : 'heart-outline'
              }
              rightIconColor={
                getIsFavorite(card.node.id) ? getColor('red-600') : undefined
              }
              rightIconSize={18}
              onPress={() =>
                router.push({
                  pathname: '/screens/auction-detail',
                  params: {
                    id: card.node.id,
                  },
                })
              }
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
              onPress={() =>
                router.push({
                  pathname: '/screens/common-detail',
                  params: {
                    id: card.node.id,
                  },
                })
              }
            />
          )
        }
      </ListContainer>
    );
  },
);

export default SimilarAdList;
