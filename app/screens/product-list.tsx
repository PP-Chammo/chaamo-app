import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, FlatList, View } from 'react-native';

import {
  Button,
  Label,
  Loading,
  Row,
  ScreenContainer,
} from '@/components/atoms';
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
import { useFavorites } from '@/hooks/useFavorites';
import { useSearchVar } from '@/hooks/useSearchVar';
import { useUserVar } from '@/hooks/useUserVar';
import { searchStore } from '@/stores/searchStore';
import { MergedItem } from '@/types/card';
import { formatThousand } from '@/utils/formatThousand';
import { getColor } from '@/utils/getColor';
import { getIndicator } from '@/utils/getIndicator';
import { renderTitleHighlight } from '@/utils/renderTitleHighlight';
import { structuredClone } from '@/utils/structuredClone';

const LOAD_MORE_SIZE = 30;
const INITIAL_PAGE_SIZE = 30;

export default function ProductListScreen() {
  const [user] = useUserVar();
  const [search, setSearch] = useSearchVar();
  const { mergedList } = useLocalSearchParams();
  const { convertUserToBase } = useCurrencyDisplay();

  const [searchText, setSearchText] = useState('');
  const [ebayPaging, setEbayPaging] = useState(false);
  const [firstLoading, setFirstLoading] = useState(false);

  const [getChaamoCards, { data }] = useGetVwChaamoListingsLazyQuery({
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
  const { getIsFavorite } = useFavorites();

  const [activeTab, setActiveTab] = useState(0);

  const allCards = useMemo(() => {
    return data?.vw_chaamo_cardsCollection?.edges ?? [];
  }, [data?.vw_chaamo_cardsCollection?.edges]);

  const auctionCards = useMemo(() => {
    return (
      data?.vw_chaamo_cardsCollection?.edges.filter(
        (item) => item.node.listing_type === ListingType.AUCTION,
      ) ?? []
    );
  }, [data?.vw_chaamo_cardsCollection?.edges]);

  const fixedCards = useMemo(() => {
    return (
      data?.vw_chaamo_cardsCollection?.edges.filter(
        (item) => item.node.listing_type === ListingType.SELL,
      ) ?? []
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

  const chaamoFilter = useMemo<VwChaamoCardsFilter>(() => {
    const and: Record<string, unknown>[] = [];
    if (search.categoryId && search.category) {
      and.push({ category_id: { eq: Number(search.categoryId) } });
    }
    if (search.location) {
      and.push({ seller_country: { ilike: `%${search.location}%` } });
    }
    if (search.priceRange) {
      if (Number(priceRange.min) > 0) {
        and.push({ start_price: { gte: priceRange.min } });
      }
      if (Number(priceRange.max) > 0) {
        and.push({ start_price: { lte: priceRange.max } });
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
    if (search.adProperties === 'featured') {
      and.push({ is_boosted: { eq: true } });
    }
    if ((search.query ?? '').trim().length > 0) {
      and.push({ name: { ilike: `%${search.query}%` } });
    }
    return {
      listing_type: { neq: ListingType.PORTFOLIO },
      and,
    } as VwChaamoCardsFilter;
  }, [
    search.categoryId,
    search.category,
    search.location,
    search.priceRange,
    search.condition,
    search.adProperties,
    search.query,
    priceRange.min,
    priceRange.max,
  ]);

  const ebayFilter = useMemo<EbayPostsFilter>(() => {
    const and: Record<string, unknown>[] = [];
    if (search.categoryId && search.category) {
      and.push({ category_id: { eq: Number(search.categoryId) } });
    }
    if (search.location) {
      and.push({ region: { ilike: `%${search.location}%` } });
    }
    if (search.priceRange) {
      if (Number(priceRange.min) > 0) {
        and.push({ price: { gte: priceRange.min } });
      }
      if (Number(priceRange.max) > 0) {
        and.push({ price: { lte: priceRange.max } });
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
    if ((search.query ?? '').trim().length > 0) {
      and.push({ name: { ilike: `%${search.query}%` } });
    }
    return { and } as EbayPostsFilter;
  }, [
    search.categoryId,
    search.category,
    search.location,
    search.priceRange,
    search.condition,
    search.query,
    priceRange.min,
    priceRange.max,
  ]);

  const resultCount = useMemo(() => {
    const allCount =
      (ebayData?.ebay_postsCollection?.totalCount ?? 0) + allCards.length;
    if (mergedList === 'true') {
      return formatThousand(allCount);
    } else {
      return [
        formatThousand(allCount),
        formatThousand(auctionCards.length ?? 0),
        formatThousand(fixedCards.length ?? 0),
      ][activeTab];
    }
  }, [
    mergedList,
    ebayData?.ebay_postsCollection?.totalCount,
    allCards.length,
    auctionCards.length,
    fixedCards.length,
    activeTab,
  ]);

  const ebayFilterRef = useRef<EbayPostsFilter>(ebayFilter);
  useEffect(() => {
    ebayFilterRef.current = ebayFilter;
  }, [ebayFilter]);

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
    let cancelled = false;
    const run = async () => {
      try {
        setFirstLoading(true);
        await Promise.all([
          getChaamoCards({ variables: { filter: chaamoFilter } }),
          getEbayPosts({
            variables: {
              filter: ebayFilterRef.current,
              orderBy: [{ sold_at: OrderByDirection.DESCNULLSLAST }],
              first: INITIAL_PAGE_SIZE,
            },
            notifyOnNetworkStatusChange: true,
          }),
        ]);
      } finally {
        if (!cancelled) {
          setEbayPaging(false);
          setFirstLoading(false);
        }
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [search, getEbayPosts, getChaamoCards, chaamoFilter]);

  const handleLoadMore = useCallback(async () => {
    if (ebayPaging || ebayLoading) return;
    const endCursor = ebayData?.ebay_postsCollection?.pageInfo?.endCursor;
    const hasNext = ebayData?.ebay_postsCollection?.pageInfo?.hasNextPage;
    if (!hasNext || !endCursor) return;

    setEbayPaging(true);
    try {
      const variables = {
        filter: ebayFilter,
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
    ebayFilter,
  ]);

  const handleRetryInitialEbay = useCallback(async () => {
    if (ebayLoading || ebayPaging) return;

    const variables = {
      filter: ebayFilter,
      orderBy: [{ sold_at: OrderByDirection.DESCNULLSLAST }],
      first: INITIAL_PAGE_SIZE,
    };

    setEbayPaging(true);
    try {
      await getEbayPosts({ variables });
    } finally {
      setEbayPaging(false);
    }
  }, [ebayLoading, ebayPaging, getEbayPosts, ebayFilter]);

  const handleBackScreen = useCallback(() => {
    setSearch(structuredClone(searchStore));
    router.back();
  }, [setSearch]);

  const mergedItems = useMemo<MergedItem[]>(() => {
    const chaamoItems: MergedItem[] = allCards.map((edge) => ({
      kind: 'chaamo',
      edge,
    }));
    const ebayItems: MergedItem[] = allEbay.map((edge) => ({
      kind: 'ebay',
      edge,
    }));
    return [...chaamoItems, ...ebayItems];
  }, [allCards, allEbay]);

  return (
    <ScreenContainer classNameTop={classes.containerTop}>
      <HeaderSearch
        value={searchText}
        onChange={handleChange}
        onBackPress={handleBackScreen}
        onSubmit={() => setSearch({ query: searchText })}
      />
      <FilterSection
        loading={ebayLoading || firstLoading}
        resultCount={resultCount}
      />
      {firstLoading ? (
        <Loading />
      ) : (
        <View className={classes.tabViewContainer}>
          {mergedList === 'true' ? (
            <FlatList
              testID="merged-product-list"
              showsVerticalScrollIndicator={false}
              data={mergedItems}
              keyExtractor={(item) => item.edge.node.id}
              renderItem={({ item }) => {
                if (item.kind === 'chaamo') {
                  const edge = item.edge;
                  return (
                    <ListingItem
                      listingType={edge.node?.listing_type ?? ListingType.SELL}
                      imageUrls={edge.node?.image_urls ?? ''}
                      title={
                        search.query?.trim()
                          ? renderTitleHighlight(
                              edge.node?.name ?? '',
                              search.query,
                            )
                          : (edge.node?.name ?? '')
                      }
                      subtitle={edge.node?.seller_username ?? ''}
                      date={edge.node.created_at ?? new Date().toISOString()}
                      currency={edge.node?.currency}
                      price={edge.node?.start_price}
                      marketCurrency={edge.node?.last_sold_currency}
                      marketPrice={edge.node?.last_sold_price}
                      lastSoldIsChecked={
                        edge.node?.last_sold_is_checked ?? false
                      }
                      lastSoldIsCorrect={
                        edge.node?.last_sold_is_correct ?? false
                      }
                      indicator={getIndicator(
                        edge.node?.start_price,
                        edge.node?.last_sold_price,
                      )}
                      onPress={() =>
                        router.push({
                          pathname: '/screens/listing-detail',
                          params: { id: edge.node?.id },
                        })
                      }
                      rightIcon={
                        getIsFavorite(edge.node?.id) ? 'heart' : 'heart-outline'
                      }
                      rightIconColor={
                        getIsFavorite(edge.node?.id)
                          ? getColor('red-600')
                          : undefined
                      }
                      rightIconSize={22}
                      onRightIconPress={() => {
                        handleToggleFavorite(
                          edge.node?.id,
                          getIsFavorite(edge.node?.id),
                        );
                      }}
                    />
                  );
                }

                const edge = item.edge;
                return (
                  <ListingItem
                    type="ebay"
                    listingType={ListingType.SELL}
                    imageUrls={edge.node?.image_url ?? ''}
                    title={
                      search.query?.trim()
                        ? renderTitleHighlight(
                            edge.node?.name ?? '',
                            search.query,
                          )
                        : (edge.node?.name ?? '')
                    }
                    subtitle={edge.node?.region ?? ''}
                    date={edge.node.sold_at ?? new Date().toISOString()}
                    currency={edge.node?.currency}
                    price={edge.node?.price}
                    marketCurrency={edge.node?.currency}
                    marketPrice={edge.node?.price}
                    indicator={getIndicator(edge.node?.price, edge.node?.price)}
                    rightIcon={undefined}
                    onPress={() =>
                      router.push({
                        pathname: '/screens/listing-detail',
                        params: { id: edge.node?.id, ebay: 'true' },
                      })
                    }
                  />
                );
              }}
              contentContainerClassName={classes.listContentContainer}
              ListFooterComponent={
                ebayLoading || ebayPaging ? (
                  <Row className={classes.loadingRow}>
                    <ActivityIndicator
                      size="small"
                      color={getColor('primary-500')}
                    />
                    <Label className={classes.footerText}>
                      {ebayLoading ? 'Loading...' : 'Load more...'}
                    </Label>
                  </Row>
                ) : ebayError && allEbay.length === 0 ? (
                  <View className={classes.errorContainer}>
                    <Label className={classes.footerText}>
                      Failed to fetch.
                    </Label>
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
            <TabView
              initialPage={activeTab}
              setActivePage={setActiveTab}
              tabs={productListTabs}
              contentClassName={classes.tabViewContainer}
            >
              <ProductAllList
                loading={ebayLoading}
                loadingMore={ebayPaging}
                isError={!!ebayError}
                cards={mergedItems}
                onFavoritePress={handleToggleFavorite}
                onFetchMore={handleLoadMore}
                onRetry={handleRetryInitialEbay}
              />
              <ProductAuctionList
                loading={firstLoading}
                cards={auctionCards}
                onFavoritePress={handleToggleFavorite}
              />
              <ProductFixedList
                loading={firstLoading}
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
};
