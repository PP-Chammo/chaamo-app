import React, { memo, useCallback, useMemo } from 'react';

import { router, useFocusEffect } from 'expo-router';

import { ListContainer, ListingCard } from '@/components/molecules';
import {
  ListingType,
  useGetVwChaamoListingsLazyQuery,
} from '@/generated/graphql';
import { getIndicator } from '@/utils/getIndicator';

interface SimilarAdListProps {
  ignoreId: string;
  listingType: ListingType;
}

const SimilarAdList: React.FC<SimilarAdListProps> = memo(
  function SimilarAdList({ ignoreId, listingType }) {
    const [getRecentlyAddedListings, { data, loading }] =
      useGetVwChaamoListingsLazyQuery({
        fetchPolicy: 'cache-and-network',
      });

    const cards = useMemo(
      () => data?.vw_chaamo_cardsCollection?.edges ?? [],
      [data?.vw_chaamo_cardsCollection?.edges],
    );

    useFocusEffect(
      useCallback(() => {
        getRecentlyAddedListings({
          variables: {
            filter: {
              id: { neq: ignoreId },
              listing_type: { eq: listingType },
              is_boosted: { eq: true },
            },
            last: 10,
          },
        });
      }, [getRecentlyAddedListings, ignoreId, listingType]),
    );

    if (loading || cards.length === 0) {
      return null;
    }

    return (
      <ListContainer noLink title="Similar Ads" data={cards}>
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
          />
        )}
      </ListContainer>
    );
  },
);

export default SimilarAdList;
