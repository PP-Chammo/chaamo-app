import React, { memo, useCallback, useMemo } from 'react';

import { router } from 'expo-router';

import { AuctionCard, CommonCard, ListContainer } from '@/components/molecules';
import {
  ListingType,
  useGetVwFeaturedListingsQuery,
  useInsertFavoritesMutation,
  useRemoveFavoritesMutation,
} from '@/generated/graphql';
import { useCurrencyDisplay } from '@/hooks/useCurrencyDisplay';
import { useUserVar } from '@/hooks/useUserVar';
import { getColor } from '@/utils/getColor';

type FeaturedListProps = {
  refreshFavoriteCount: () => void;
};

const FeaturedList: React.FC<FeaturedListProps> = memo(function FeaturedList({
  refreshFavoriteCount,
}) {
  const [user] = useUserVar();
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

  const [insertFavorites] = useInsertFavoritesMutation();
  const [removeFavorites] = useRemoveFavoritesMutation();

  const cards = useMemo(
    () => data?.vw_featured_cardsCollection?.edges ?? [],
    [data?.vw_featured_cardsCollection?.edges],
  );

  const handleToggleFavorite = useCallback(
    (listingId: string, isFavorite: boolean) => () => {
      if (isFavorite) {
        removeFavorites({
          variables: {
            filter: {
              user_id: { eq: user?.id },
              listing_id: { eq: listingId },
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
                user_id: user?.id,
                listing_id: listingId,
              },
            ],
          },
          onCompleted: () => {
            refreshFavoriteCount();
          },
        });
      }
    },
    [insertFavorites, user?.id, refreshFavoriteCount, removeFavorites],
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
      {(card) =>
        card.node.listing_type === ListingType.AUCTION ? (
          <AuctionCard
            key={card.node.id}
            id={card.node.id}
            imageUrl={card.node?.image_url ?? ''}
            title={card.node?.name ?? ''}
            price={formatDisplay(card.node?.currency, card.node?.start_price)}
            onPress={() =>
              router.push({
                pathname: '/screens/auction-detail',
                params: {
                  id: card.node.id,
                  isFavorite: String(card.node.is_favorite),
                },
              })
            }
            rightIcon={card.node?.is_favorite ? 'heart' : 'heart-outline'}
            rightIconColor={
              card.node?.is_favorite ? getColor('red-600') : undefined
            }
            rightIconSize={18}
            onRightIconPress={handleToggleFavorite(
              card.node.id,
              card.node?.is_favorite ?? false,
            )}
          />
        ) : (
          <CommonCard
            key={card.node.id}
            id={card.node.id}
            imageUrl={card.node?.image_url ?? ''}
            title={card.node?.name ?? ''}
            price={formatDisplay(card.node?.currency, card.node?.price)}
            marketType={
              card.node.listing_type === ListingType.EBAY ? 'eBay' : 'chaamo'
            }
            marketPrice={formatDisplay(card.node?.currency, 0)}
            indicator="up"
            onPress={() =>
              router.push({
                pathname: '/screens/common-detail',
                params: {
                  id: card.node.id,
                  isFavorite: String(card.node?.is_favorite ?? false),
                },
              })
            }
            rightIcon={card.node?.is_favorite ? 'heart' : 'heart-outline'}
            rightIconColor={
              card.node?.is_favorite ? getColor('red-600') : undefined
            }
            rightIconSize={18}
            onRightIconPress={handleToggleFavorite(
              card.node.id,
              card.node?.is_favorite ?? false,
            )}
          />
        )
      }
    </ListContainer>
  );
});

export default FeaturedList;
