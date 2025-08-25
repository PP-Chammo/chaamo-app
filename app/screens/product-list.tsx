import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, FlatList, View, Text } from 'react-native';

import { Button, Loading, Row, ScreenContainer } from '@/components/atoms';
import {
  ListingItem,
  FilterSection,
  HeaderSearch,
  TabView,
} from '@/components/molecules';
import {
  ProductAllList,
  ProductAuctionList,
  ProductFixedList,
} from '@/components/organisms';
import { productListTabs } from '@/constants/tabs';
import { TextChangeParams } from '@/domains';
import {
  ListingType,
  useGetVwChaamoListingsLazyQuery,
  useGetEbayPostsLazyQuery,
  useCreateFavoritesMutation,
  useRemoveFavoritesMutation,
  OrderByDirection,
  type EbayPostsFilter,
  type VwChaamoCardsFilter,
} from '@/generated/graphql';
import { useCurrencyDisplay } from '@/hooks/useCurrencyDisplay';
import { useSearchVar } from '@/hooks/useSearchVar';
import { useUserVar } from '@/hooks/useUserVar';
import { searchStore } from '@/stores/searchStore';
import { escapeRegExp } from '@/utils/escapeRegExp';
import { formatThousand } from '@/utils/formatThousand';
import { getColor } from '@/utils/getColor';
import { getIndicator } from '@/utils/getIndicator';
import { structuredClone } from '@/utils/structuredClone';

const LOAD_MORE_SIZE = 30;
const INITIAL_PAGE_SIZE = 30;

export default function ProductListScreen() {
  const [user] = useUserVar();
  const { ebayOnly } = useLocalSearchParams();
  const [search, setSearch] = useSearchVar();
  const { convertUserToBase } = useCurrencyDisplay();

  const [searchText, setSearchText] = useState('');
  const [ebayPaging, setEbayPaging] = useState(false);
  const [firstLoading, setFirstLoading] = useState(false);

  const [getChaamoCards, { data, loading }] = useGetVwChaamoListingsLazyQuery({
    fetchPolicy: 'cache-and-network',
  });
  const [
    getEbayPosts,
    {
      data: ebayData,
      loading: ebayLoading,
      error: ebayError,
      fetchMore: fetchMoreEbay,
    },
  ] = useGetEbayPostsLazyQuery({ fetchPolicy: 'cache-and-network' });
  const [createFavorites] = useCreateFavoritesMutation();
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

  const allEbay = useMemo(() => {
    return ebayData?.ebay_postsCollection?.edges ?? [];
  }, [ebayData?.ebay_postsCollection?.edges]);

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

  const nonQueryFilter = useMemo<
    Partial<EbayPostsFilter> & Partial<VwChaamoCardsFilter>
  >(() => {
    const and: Record<string, unknown>[] = [];
    if (search.categoryId && search.category) {
      and.push({ category_id: { eq: Number(search.categoryId) } });
    }
    if (search.location) {
      and.push(
        ...(ebayOnly === 'true'
          ? [{ region: { ilike: `%${search.location}%` } }]
          : [{ seller_country: { ilike: `%${search.location}%` } }]),
      );
    }
    if (search.priceRange) {
      if (Number(priceRange.min) > 0) {
        and.push(
          ...(ebayOnly === 'true'
            ? [{ price: { gte: priceRange.min } }]
            : [{ start_price: { gte: priceRange.min } }]),
        );
      }
      if (Number(priceRange.max) > 0) {
        and.push(
          ...(ebayOnly === 'true'
            ? [{ price: { lte: priceRange.max } }]
            : [{ start_price: { lte: priceRange.max } }]),
        );
      }
    }
    if (search.condition === 'graded') {
      and.push({
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
      });
    } else if (search.condition === 'raw') {
      and.push({
        not: {
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
      });
    }
    if (ebayOnly !== 'true') {
      if (search.adProperties === 'featured') {
        and.push({ is_boosted: { eq: true } });
      }
    }
    const base =
      ebayOnly === 'true'
        ? {}
        : { listing_type: { neq: ListingType.PORTFOLIO } };

    return {
      ...base,
      and,
    };
  }, [
    search.categoryId,
    search.category,
    search.location,
    search.priceRange,
    search.condition,
    search.adProperties,
    ebayOnly,
    priceRange.min,
    priceRange.max,
  ]);

  const productFilter = useMemo<
    Partial<EbayPostsFilter> & Partial<VwChaamoCardsFilter>
  >(() => {
    type AndFilter = { and?: Record<string, unknown>[] };
    const baseAnd = (nonQueryFilter as AndFilter).and ?? [];
    const and = [...baseAnd];
    if (search.query) {
      and.push({ name: { ilike: `%${search.query}%` } });
    }
    return { ...nonQueryFilter, and };
  }, [nonQueryFilter, search.query]);

  const productFilterRef = useRef<
    Partial<EbayPostsFilter> & Partial<VwChaamoCardsFilter>
  >(productFilter);
  useEffect(() => {
    productFilterRef.current = productFilter;
  }, [productFilter]);

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
        });
      } else {
        createFavorites({
          variables: {
            objects: [
              {
                user_id: user?.id,
                listing_id: listingId,
              },
            ],
          },
        });
      }
    },
    [createFavorites, removeFavorites, user?.id],
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

  useEffect(() => {
    try {
      if (ebayOnly === 'true') {
        const variables = {
          filter: productFilterRef.current as EbayPostsFilter,
          orderBy: [{ sold_at: OrderByDirection.DESCNULLSLAST }],
          first: INITIAL_PAGE_SIZE,
        };
        setEbayPaging(true);
        setFirstLoading(true);
        getEbayPosts({
          variables,
          notifyOnNetworkStatusChange: true,
        }).finally(() => {
          setEbayPaging(false);
          setFirstLoading(false);
        });
      } else {
        getChaamoCards({
          variables: {
            filter: productFilterRef.current as VwChaamoCardsFilter,
          },
        }).finally(() => {
          setFirstLoading(false);
        });
      }
    } catch {
      setFirstLoading(false);
    }
  }, [ebayOnly, search, getEbayPosts, getChaamoCards]);

  const handleLoadMore = useCallback(async () => {
    if (ebayPaging || ebayLoading) return;
    const endCursor = ebayData?.ebay_postsCollection?.pageInfo?.endCursor;
    const hasNext = ebayData?.ebay_postsCollection?.pageInfo?.hasNextPage;
    if (!hasNext || !endCursor) return;

    setEbayPaging(true);
    try {
      const variables = {
        filter: productFilter as EbayPostsFilter,
        orderBy: [{ sold_at: OrderByDirection.DESCNULLSLAST }],
        first: LOAD_MORE_SIZE,
        after: endCursor,
      };

      await fetchMoreEbay({
        variables,
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev;
          const prevCol = prev.ebay_postsCollection;
          const nextCol = fetchMoreResult.ebay_postsCollection;
          return {
            ...prev,
            ebay_postsCollection: {
              __typename:
                prevCol?.__typename ??
                nextCol?.__typename ??
                'ebay_postsConnection',
              totalCount: nextCol?.totalCount ?? prevCol?.totalCount ?? 0,
              edges: [...(prevCol?.edges ?? []), ...(nextCol?.edges ?? [])],
              pageInfo: nextCol?.pageInfo ??
                prevCol?.pageInfo ?? {
                  __typename: 'PageInfo',
                  endCursor: null,
                  hasNextPage: false,
                },
            },
          };
        },
      });
    } finally {
      setEbayPaging(false);
    }
  }, [
    ebayPaging,
    ebayLoading,
    ebayData?.ebay_postsCollection?.pageInfo?.endCursor,
    ebayData?.ebay_postsCollection?.pageInfo?.hasNextPage,
    fetchMoreEbay,
    productFilter,
  ]);

  const handleRetryInitialEbay = useCallback(async () => {
    if (ebayLoading || ebayPaging) return;

    const variables = {
      filter: productFilter as EbayPostsFilter,
      orderBy: [{ sold_at: OrderByDirection.DESCNULLSLAST }],
      first: INITIAL_PAGE_SIZE,
    };

    setEbayPaging(true);
    try {
      await getEbayPosts({ variables });
    } finally {
      setEbayPaging(false);
    }
  }, [ebayLoading, ebayPaging, getEbayPosts, productFilter]);

  const handleBackScreen = useCallback(() => {
    if (ebayOnly === 'true') {
      setSearch(structuredClone(searchStore));
    }
    router.back();
  }, [ebayOnly, setSearch]);

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
                  ? [{ name: { ilike: `${search.query}%` } }]
                  : []),
                ...(!!search.category
                  ? [{ name: { ilike: `${search.category}%` } }]
                  : []),
              ],
            },
          },
        });
      }
    }, [getChaamoCards, search.category, search.query, searchText]),
  );

  const renderTitleWithHighlight = useCallback(
    (titleText: string) => {
      const q = (search.query ?? '').trim();
      if (!q) return titleText;
      const regex = new RegExp(`(${escapeRegExp(q)})`, 'ig');
      const parts = titleText.split(regex);
      return (
        <>
          {parts.map((part, idx) =>
            idx % 2 === 1 ? (
              <Text key={idx} className={classes.titleHighlight}>
                {part}
              </Text>
            ) : (
              <Text key={idx}>{part}</Text>
            ),
          )}
        </>
      );
    },
    [search.query],
  );

  return (
    <ScreenContainer classNameTop={classes.containerTop}>
      <HeaderSearch
        value={searchText}
        onChange={handleChange}
        onBackPress={handleBackScreen}
        onSubmit={() => setSearch({ query: searchText })}
      />
      <FilterSection
        resultCount={
          ebayOnly === 'true'
            ? formatThousand(
                ebayData?.ebay_postsCollection?.totalCount ?? allEbay.length,
              )
            : formatThousand(allCards.length)
        }
      />
      {firstLoading ? (
        <Loading />
      ) : (
        <View className={classes.tabViewContainer}>
          {ebayOnly === 'true' ? (
            <FlatList
              testID="ebay-posts-list"
              showsVerticalScrollIndicator={false}
              data={allEbay}
              keyExtractor={(item) => item.node.id}
              renderItem={({ item }) => (
                <ListingItem
                  type="ebay"
                  listingType={ListingType.SELL}
                  imageUrl={item.node?.image_url ?? ''}
                  title={
                    search.query?.trim()
                      ? renderTitleWithHighlight(item.node?.name ?? '')
                      : (item.node?.name ?? '')
                  }
                  subtitle={item.node?.region ?? ''}
                  date={item.node.sold_at ?? new Date().toISOString()}
                  currency={item.node?.currency}
                  price={item.node?.price}
                  marketCurrency={item.node?.currency}
                  marketPrice={item.node?.price}
                  indicator={getIndicator(item.node?.price, item.node?.price)}
                  rightIcon={undefined}
                  onPress={() => {
                    router.push({
                      pathname: '/screens/listing-detail',
                      params: {
                        ebayOnly: 'true',
                        image_url: item.node?.image_url ?? '',
                        name: item.node?.name ?? '',
                        currency: item.node?.currency ?? '',
                        price: String(item.node?.price ?? 0),
                        date: item.node?.sold_at ?? new Date().toISOString(),
                      },
                    });
                  }}
                />
              )}
              contentContainerClassName={classes.listContentContainer}
              ListFooterComponent={
                ebayLoading || ebayPaging ? (
                  <Row className={classes.loadingRow}>
                    <ActivityIndicator
                      size="small"
                      color={getColor('primary-500')}
                    />
                    <Text className={classes.footerText}>
                      {ebayLoading ? 'Loading...' : 'Load more...'}
                    </Text>
                  </Row>
                ) : ebayError && allEbay.length === 0 ? (
                  <View className={classes.errorContainer}>
                    <Text className={classes.footerText}>Failed to fetch.</Text>
                    <Button
                      variant="primary-light"
                      size="small"
                      disabled={ebayLoading || ebayPaging}
                      onPress={handleRetryInitialEbay}
                      className={classes.retryButton}
                    >
                      Retry
                    </Button>
                  </View>
                ) : null
              }
              onEndReached={handleLoadMore}
              onEndReachedThreshold={3}
            />
          ) : (
            <TabView className={classes.tabView} tabs={productListTabs}>
              <ProductAllList
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
          )}
        </View>
      )}
    </ScreenContainer>
  );
}

const classes = {
  containerTop: 'bg-white',
  tabView: 'mt-2 mx-4.5',
  tabViewContainer: 'flex-1',
  listContentContainer: 'gap-4 py-4.5 mt-2 mx-4.5',
  loadingRow: 'py-4 items-center justify-center gap-2',
  errorContainer: 'py-4 items-center justify-center gap-10',
  footerText: 'text-gray-500',
  retryButton: '!min-w-28',
  titleHighlight: 'text-primary-500 font-bold',
};
