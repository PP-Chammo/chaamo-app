import React, { memo, useCallback, useMemo } from 'react';

import { router } from 'expo-router';

import { AuctionCard, ListContainer } from '@/components/molecules';
import {
  ListingType,
  useGetVwChaamoListingsQuery,
  useInsertFavoritesMutation,
  useRemoveFavoritesMutation,
} from '@/generated/graphql';
import { useCurrencyDisplay } from '@/hooks/useCurrencyDisplay';
import { useUserVar } from '@/hooks/useUserVar';
import { getColor } from '@/utils/getColor';

type AuctionListProps = {
  refreshFavoriteCount: () => void;
};

const AuctionList: React.FC<AuctionListProps> = memo(function AuctionList({
  refreshFavoriteCount,
}) {
  const [user] = useUserVar();
  const { formatDisplay } = useCurrencyDisplay();

  const { data, loading } = useGetVwChaamoListingsQuery({
    fetchPolicy: 'cache-and-network',
    variables: {
      filter: {
        listing_type: { eq: ListingType.AUCTION },
      },
    },
  });

  const [insertFavorites] = useInsertFavoritesMutation();
  const [removeFavorites] = useRemoveFavoritesMutation();

  const cards = useMemo(
    () => data?.vw_chaamo_cardsCollection?.edges ?? [],
    [data?.vw_chaamo_cardsCollection?.edges],
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
      )}
    </ListContainer>
  );
});

const classes = {
  headerContainer: 'pt-5',
  container: 'bg-white',
};

export default AuctionList;
