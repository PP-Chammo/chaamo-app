import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';

import { Loading, ScreenContainer } from '@/components/atoms';
import { FilterSection, HeaderSearch, TabView } from '@/components/molecules';
import {
  ProductAllList,
  ProductAuctionList,
  ProductFixedList,
} from '@/components/organisms';
import { productListTabs } from '@/constants/tabs';
import { TextChangeParams } from '@/domains';
import {
  ListingType,
  useGetVwListingCardsLazyQuery,
  useGetEbayPostsLazyQuery,
  useCreateFavoritesMutation,
  useRemoveFavoritesMutation,
  OrderByDirection,
  type EbayPostsFilter,
  type VwListingCardsFilter,
} from '@/generated/graphql';
import { useCurrencyDisplay } from '@/hooks/useCurrencyDisplay';
import { useSearchVar } from '@/hooks/useSearchVar';
import { useUserVar } from '@/hooks/useUserVar';
import { searchStore } from '@/stores/searchStore';
import { MergedItem } from '@/types/card';
import { formatThousand } from '@/utils/formatThousand';
import { structuredClone } from '@/utils/structuredClone';

const LOAD_MORE_SIZE = 50;
const INITIAL_PAGE_SIZE = 50;

export default function ProductListScreen() {
  const [user] = useUserVar();
  const [search, setSearch] = useSearchVar();
  const { mergedList, chaamoOnly, firstTab, featuredOnly } =
    useLocalSearchParams();
  const { convertUserToBase } = useCurrencyDisplay();

  const [searchText, setSearchText] = useState('');
  const [ebayPaging, setEbayPaging] = useState(false);
  const [firstLoading, setFirstLoading] = useState(false);

  const [getListingCards, { data }] = useGetVwListingCardsLazyQuery({
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
  ] = useGetEbayPostsLazyQuery({ fetchPolicy: 'cache-first' });
  const [createFavorites] = useCreateFavoritesMutation();
  const [removeFavorites] = useRemoveFavoritesMutation();

  const [activeTab, setActiveTab] = useState(0);

  const isChaamoOnly = useMemo(() => chaamoOnly === 'true', [chaamoOnly]);
  const isAuction = useMemo(() => firstTab === 'auctionTab', [firstTab]);
  const isRecentlyAdded = useMemo(() => firstTab === 'fixedTab', [firstTab]);

  const productTabs = useMemo(() => {
    if (isAuction) {
      return [productListTabs[1], productListTabs[2]];
    }
    if (isRecentlyAdded) {
      return [productListTabs[2], productListTabs[1]];
    }
    return productListTabs;
  }, [isAuction, isRecentlyAdded]);

  const allCards = useMemo(() => {
    return data?.vw_listing_cardsCollection?.edges ?? [];
  }, [data?.vw_listing_cardsCollection?.edges]);

  const auctionCards = useMemo(() => {
    return (
      data?.vw_listing_cardsCollection?.edges.filter(
        (item) => item.node.listing_type === ListingType.AUCTION,
      ) ?? []
    );
  }, [data?.vw_listing_cardsCollection?.edges]);

  const fixedCards = useMemo(() => {
    return (
      data?.vw_listing_cardsCollection?.edges.filter(
        (item) => item.node.listing_type === ListingType.SELL,
      ) ?? []
    );
  }, [data?.vw_listing_cardsCollection?.edges]);

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

  const chaamoFilter = useMemo<VwListingCardsFilter>(() => {
    const and: Record<string, unknown>[] = [];
    if (featuredOnly === 'true') {
      and.push({ is_boosted: { eq: true } });
    }
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
          { title: { ilike: `%PSA%` } },
          { title: { ilike: `%BGS%` } },
          { title: { ilike: `%SGC%` } },
          { title: { ilike: `%CGC%` } },
          { title: { ilike: `%CSG%` } },
          { title: { ilike: `%HGA%` } },
          { title: { ilike: `%GMA%` } },
          { title: { ilike: `%Beckett%` } },
        ],
      });
    } else if (search.condition === 'raw') {
      and.push({
        not: {
          or: [
            { title: { ilike: `%PSA%` } },
            { title: { ilike: `%BGS%` } },
            { title: { ilike: `%SGC%` } },
            { title: { ilike: `%CGC%` } },
            { title: { ilike: `%CSG%` } },
            { title: { ilike: `%HGA%` } },
            { title: { ilike: `%GMA%` } },
            { title: { ilike: `%Beckett%` } },
          ],
        },
      });
    }
    if (search.adProperties === 'featured') {
      and.push({ is_boosted: { eq: true } });
    }
    if ((search.query ?? '').trim().length > 0) {
      and.push({ title: { ilike: `%${search.query}%` } });
    }
    return {
      listing_type: { neq: ListingType.PORTFOLIO },
      and,
    } as VwListingCardsFilter;
  }, [
    featuredOnly,
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
          { title: { ilike: `%PSA%` } },
          { title: { ilike: `%BGS%` } },
          { title: { ilike: `%SGC%` } },
          { title: { ilike: `%CGC%` } },
          { title: { ilike: `%CSG%` } },
          { title: { ilike: `%HGA%` } },
          { title: { ilike: `%GMA%` } },
          { title: { ilike: `%Beckett%` } },
        ],
      });
    } else if (search.condition === 'raw') {
      and.push({
        not: {
          or: [
            { title: { ilike: `%PSA%` } },
            { title: { ilike: `%BGS%` } },
            { title: { ilike: `%SGC%` } },
            { title: { ilike: `%CGC%` } },
            { title: { ilike: `%CSG%` } },
            { title: { ilike: `%HGA%` } },
            { title: { ilike: `%GMA%` } },
            { title: { ilike: `%Beckett%` } },
          ],
        },
      });
    }
    if ((search.query ?? '').trim().length > 0) {
      const splittedQuery = search.query
        .split(' ')
        .filter((q) => q.trim().length > 0);
      and.push({
        or: splittedQuery.map((q) => ({ title: { ilike: `%${q.trim()}%` } })),
      });
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
        formatThousand(allCards.length ?? 0),
        formatThousand(auctionCards.length ?? 0),
        formatThousand(fixedCards.length ?? 0),
      ][activeTab];
    }
  }, [
    ebayData?.ebay_postsCollection?.totalCount,
    allCards.length,
    mergedList,
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

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      const run = async () => {
        try {
          setFirstLoading(true);
          await Promise.all([
            getListingCards({ variables: { filter: chaamoFilter } }),
            ...(!isChaamoOnly
              ? [
                  getEbayPosts({
                    variables: {
                      filter: ebayFilterRef.current,
                      orderBy: [{ sold_at: OrderByDirection.DESCNULLSLAST }],
                      first: INITIAL_PAGE_SIZE,
                    },
                    notifyOnNetworkStatusChange: true,
                  }),
                ]
              : []),
            ,
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
    }, [getEbayPosts, getListingCards, chaamoFilter, isChaamoOnly]),
  );

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
      if (isChaamoOnly) {
        await getListingCards({ variables: { filter: chaamoFilter } });
      } else {
        if (Number(resultCount) < allCards.length) {
          await getListingCards({ variables: { filter: chaamoFilter } });
        } else {
          await getEbayPosts({ variables });
        }
      }
    } finally {
      setEbayPaging(false);
    }
  }, [
    allCards.length,
    chaamoFilter,
    ebayFilter,
    ebayLoading,
    ebayPaging,
    getListingCards,
    getEbayPosts,
    isChaamoOnly,
    resultCount,
  ]);

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
          <TabView
            initialPage={activeTab}
            setActivePage={setActiveTab}
            tabs={productTabs}
            contentClassName={classes.tabViewContainer}
          >
            {isRecentlyAdded && (
              <ProductFixedList
                loading={firstLoading}
                cards={fixedCards}
                onFavoritePress={handleToggleFavorite}
              />
            )}
            {!isRecentlyAdded && !isAuction && (
              <ProductAllList
                loading={ebayLoading}
                loadingMore={ebayPaging}
                isError={!!ebayError}
                cards={mergedItems}
                onFavoritePress={handleToggleFavorite}
                onFetchMore={handleLoadMore}
                onRetry={handleRetryInitialEbay}
              />
            )}
            <ProductAuctionList
              loading={firstLoading}
              cards={auctionCards}
              onFavoritePress={handleToggleFavorite}
            />
            {!isRecentlyAdded && (
              <ProductFixedList
                loading={firstLoading}
                cards={fixedCards}
                onFavoritePress={handleToggleFavorite}
              />
            )}
          </TabView>
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
