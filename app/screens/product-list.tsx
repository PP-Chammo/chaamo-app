import { useCallback, useMemo, useState } from 'react';

import { router, useFocusEffect } from 'expo-router';
import { View } from 'react-native';

import { ScreenContainer } from '@/components/atoms';
import { FilterSection, HeaderSearch, TabView } from '@/components/molecules';
import {
  ProductAuctionList,
  ProductCardList,
  ProductFixedList,
} from '@/components/organisms';
import { productListTabs } from '@/constants/tabs';
import { TextChangeParams } from '@/domains';
import {
  ListingType,
  useGetVwChaamoListingsLazyQuery,
  useInsertFavoritesMutation,
  useRemoveFavoritesMutation,
} from '@/generated/graphql';
import { useCurrencyDisplay } from '@/hooks/useCurrencyDisplay';
import { useSearchVar } from '@/hooks/useSearchVar';
import { useUserVar } from '@/hooks/useUserVar';

export default function ProductListScreen() {
  const [user] = useUserVar();
  const [search, setSearch] = useSearchVar();
  const { convertUserToBase } = useCurrencyDisplay();

  const [searchText, setSearchText] = useState('');

  const [getChaamoCards, { data, loading, refetch }] =
    useGetVwChaamoListingsLazyQuery({
      fetchPolicy: 'cache-and-network',
    });
  const [insertFavorites] = useInsertFavoritesMutation();
  const [removeFavorites] = useRemoveFavoritesMutation();

  const allCards = useMemo(() => {
    return data?.vw_chaamo_cardsCollection?.edges ?? [];
  }, [data?.vw_chaamo_cardsCollection?.edges]);

  const auctionCards = useMemo(() => {
    const auctionCards = data?.vw_chaamo_cardsCollection?.edges ?? [];
    return auctionCards.filter(
      (card) => card.node.listing_type === ListingType.AUCTION,
    );
  }, [data?.vw_chaamo_cardsCollection?.edges]);

  const fixedCards = useMemo(() => {
    const fixedCards = data?.vw_chaamo_cardsCollection?.edges ?? [];
    return fixedCards.filter(
      (card) => card.node.listing_type === ListingType.SELL,
    );
  }, [data?.vw_chaamo_cardsCollection?.edges]);

  const priceRange = useMemo(() => {
    const priceRangeValues = search.priceRange?.split(',') ?? [];
    return {
      min:
        priceRangeValues[0]?.length > 0
          ? convertUserToBase(priceRangeValues[0]).toFixed(2)
          : 0,
      max:
        priceRangeValues[1]?.length > 0
          ? convertUserToBase(priceRangeValues[1]).toFixed(2)
          : 0,
    };
  }, [convertUserToBase, search.priceRange]);

  const handleChange = useCallback(
    ({ value }: TextChangeParams) => setSearchText(value),
    [setSearchText],
  );

  const handleToggleFavorite = useCallback(
    (listingId: string, isFavorite: boolean) => {
      if (isFavorite) {
        removeFavorites({
          variables: {
            filter: {
              user_id: { eq: user?.id },
              listing_id: { eq: listingId },
            },
          },
          onCompleted: () => {
            refetch();
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
            refetch();
          },
        });
      }
    },
    [insertFavorites, refetch, removeFavorites, user?.id],
  );

  useFocusEffect(
    useCallback(() => {
      if (search?.query) {
        setSearchText(search.query);
      }
      return () => {
        setSearchText('');
      };
    }, [search.query]),
  );

  useFocusEffect(
    useCallback(() => {
      getChaamoCards({
        variables: {
          filter: {
            listing_type: { neq: ListingType.PORTFOLIO },
            and: [
              ...(!!search.query
                ? [{ name: { ilike: `%${search.query}%` } }]
                : []),
              ...(!!search.category
                ? [{ name: { ilike: `%${search.category}%` } }]
                : []),
              ...(!!search.location
                ? [{ seller_country: { ilike: `%${search.location}%` } }]
                : []),
              ...(!!search.priceRange
                ? [
                    ...(Number(priceRange.min) > 0 && Number(priceRange.max) > 0
                      ? [
                          {
                            and: [
                              ...(Number(priceRange.min) > 0
                                ? [
                                    {
                                      or: [
                                        { price: { gte: priceRange.min } },
                                        {
                                          start_price: { gte: priceRange.min },
                                        },
                                      ],
                                    },
                                  ]
                                : []),
                              ...(Number(priceRange.max) > 0
                                ? [
                                    {
                                      or: [
                                        { price: { lte: priceRange.max } },
                                        {
                                          start_price: { lte: priceRange.max },
                                        },
                                      ],
                                    },
                                  ]
                                : []),
                            ],
                          },
                        ]
                      : [
                          ...(Number(priceRange.min) > 0
                            ? [
                                {
                                  or: [
                                    { price: { gte: priceRange.min } },
                                    {
                                      start_price: { gte: priceRange.min },
                                    },
                                  ],
                                },
                              ]
                            : []),
                          ...(Number(priceRange.max) > 0
                            ? [
                                {
                                  or: [
                                    { price: { lte: priceRange.max } },
                                    {
                                      start_price: { lte: priceRange.max },
                                    },
                                  ],
                                },
                              ]
                            : []),
                        ]),
                  ]
                : []),
              ...(!!search.condition
                ? search.condition === 'graded'
                  ? [
                      {
                        or: [
                          { name: { ilike: `%PSA%` } },
                          { name: { ilike: `%BGS%` } },
                          { name: { ilike: `%SGC%` } },
                          { name: { ilike: `%CGC%` } },
                          { name: { ilike: `%CSG%` } },
                          { name: { ilike: `%HGA%` } },
                          { name: { ilike: `%GMA%` } },
                          { name: { ilike: `%Beckett%` } },
                        ],
                      },
                    ]
                  : [{ name: { ilike: `%${search.category}%` } }]
                : []),
              ...(search.adProperties === 'featured'
                ? [{ is_boosted: { eq: true } }]
                : []),
            ],
          },
        },
      });
    }, [
      getChaamoCards,
      priceRange.max,
      priceRange.min,
      search.adProperties,
      search.category,
      search.condition,
      search.location,
      search.priceRange,
      search.query,
    ]),
  );

  useFocusEffect(
    useCallback(() => {
      if (search?.query) {
        setSearchText(search.query);
      }
      return () => {
        setSearchText('');
      };
    }, [search.query]),
  );

  useFocusEffect(
    useCallback(() => {
      if (searchText) {
        getChaamoCards({
          variables: {
            filter: {
              and: [
                ...(!!search.query
                  ? [{ name: { ilike: `%${search.query}%` } }]
                  : []),
                ...(!!search.category
                  ? [{ name: { ilike: `%${search.category}%` } }]
                  : []),
              ],
            },
          },
        });
      }
    }, [getChaamoCards, search.category, search.query, searchText]),
  );

  return (
    <ScreenContainer
      classNameTop={classes.containerTop}
      enableBottomSafeArea={false}
    >
      <HeaderSearch
        value={searchText}
        onChange={handleChange}
        onBackPress={() => router.back()}
        onSubmit={() => setSearch({ query: searchText })}
      />
      <FilterSection resultCount={allCards.length} />
      <View className={classes.tabViewContainer}>
        <TabView className={classes.tabView} tabs={productListTabs}>
          <ProductCardList
            loading={loading}
            cards={allCards}
            onFavoritePress={handleToggleFavorite}
          />
          <ProductAuctionList
            loading={loading}
            cards={auctionCards}
            onFavoritePress={handleToggleFavorite}
          />
          <ProductFixedList
            loading={loading}
            cards={fixedCards}
            onFavoritePress={handleToggleFavorite}
          />
        </TabView>
      </View>
    </ScreenContainer>
  );
}

const classes = {
  containerTop: 'bg-white',
  tabView: 'mt-2 mx-4.5',
  tabViewContainer: 'flex-1',
};
