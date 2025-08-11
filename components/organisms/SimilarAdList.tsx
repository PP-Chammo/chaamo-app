import React, { memo, useMemo } from 'react';

import { router } from 'expo-router';

import { ListContainer, ListingCard } from '@/components/molecules';
import {
  ListingType,
  useGetVwFeaturedListingsQuery,
} from '@/generated/graphql';
import { useCurrencyDisplay } from '@/hooks/useCurrencyDisplay';

interface SimilarAdListProps {
  ignoreListingId: string;
  listingType: ListingType;
}

const SimilarAdList: React.FC<SimilarAdListProps> = memo(
  function SimilarAdList({ ignoreListingId, listingType }) {
    const { formatDisplay } = useCurrencyDisplay();

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
            price={formatDisplay(
              card.node?.currency,
              card.node?.start_price ?? card.node?.price,
            )}
            marketPrice={
              card?.node?.price
                ? `${card.node.currency?.trim()}${card.node.price?.trim()}`
                : ''
            }
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
          />
        )}
      </ListContainer>
    );
  },
);

export default SimilarAdList;
