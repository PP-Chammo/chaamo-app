import { memo, useCallback, useMemo } from 'react';

import { router } from 'expo-router';

import { AuctionCard, CommonCard, ListContainer } from '@/components/molecules';
import {
  GetVwChaamoListingsQuery,
  GetFavoritesQuery,
  ListingType,
  useGetVwChaamoListingsQuery,
  useInsertFavoritesMutation,
  useRemoveFavoritesMutation,
} from '@/generated/graphql';
import { useCurrencyDisplay } from '@/hooks/useCurrencyDisplay';
import { useUserVar } from '@/hooks/useUserVar';
import { DeepGet } from '@/types/helper';
import { getColor } from '@/utils/getColor';

type RecentlyAddedListProps = {
  favoriteList: DeepGet<
    GetFavoritesQuery,
    ['favorite_listingsCollection', 'edges']
  >;
  refreshFavoriteCount: () => void;
};

const RecentlyAddedList: React.FC<RecentlyAddedListProps> = memo(
  function RecentlyAddedList({ favoriteList = [], refreshFavoriteCount }) {
    const [user] = useUserVar();
    const { formatDisplay } = useCurrencyDisplay();

    const { data, loading } = useGetVwChaamoListingsQuery({
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
      () => data?.vw_chaamo_cardsCollection?.edges ?? [],
      [data?.vw_chaamo_cardsCollection?.edges],
    );

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
                user_id: { eq: user?.id },
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
                  user_id: user?.id,
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
        user?.id,
        refreshFavoriteCount,
        removeFavorites,
      ],
    );

    if (loading) {
      return null;
    }

    return (
      <ListContainer<
        DeepGet<
          GetVwChaamoListingsQuery,
          ['vw_chaamo_cardsCollection', 'edges', number]
        >
      >
        title="Recently Added"
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
                    isFavorite: String(getIsFavorite(card.node.id)),
                  },
                })
              }
              rightIcon={
                getIsFavorite(card.node.id) ? 'heart' : 'heart-outline'
              }
              rightIconColor={
                getIsFavorite(card.node.id) ? getColor('red-600') : undefined
              }
              rightIconSize={18}
              onRightIconPress={handleToggleFavorite(card.node.id)}
            />
          ) : (
            <CommonCard
              key={card.node.id}
              id={card.node.id}
              imageUrl={card.node?.image_url ?? ''}
              title={card.node?.name ?? ''}
              price={formatDisplay(card.node?.currency, card.node?.price)}
              marketType="eBay"
              marketPrice={formatDisplay(card.node?.currency, 0)}
              indicator="up"
              onPress={() =>
                router.push({
                  pathname: '/screens/common-detail',
                  params: {
                    id: card.node.id,
                    isFavorite: String(getIsFavorite(card.node.id)),
                  },
                })
              }
              rightIcon={
                getIsFavorite(card.node.id) ? 'heart' : 'heart-outline'
              }
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
  },
);

export default RecentlyAddedList;
