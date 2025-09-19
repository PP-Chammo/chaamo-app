import { memo } from 'react';

import { router } from 'expo-router';
import { cssInterop } from 'nativewind';
import { ActivityIndicator, FlatList, View } from 'react-native';

import { Button, Label, Row } from '@/components/atoms';
import { ListingItem } from '@/components/molecules';
import { ListingType } from '@/generated/graphql';
import { useFavorites } from '@/hooks/useFavorites';
import { useSearchVar } from '@/hooks/useSearchVar';
import { MergedItem } from '@/types/card';
import { getColor } from '@/utils/getColor';
import { getIndicator } from '@/utils/getIndicator';
import { renderTitleHighlight } from '@/utils/renderTitleHighlight';

cssInterop(FlatList, {
  contentContainerClassName: {
    target: 'contentContainerStyle',
  },
});

interface ProductAllListProps {
  loading: boolean;
  loadingMore: boolean;
  isError: boolean;
  cards: MergedItem[];
  onFavoritePress: (listingId: string, isFavorite: boolean) => void;
  onFetchMore: () => void;
  onRetry: () => void;
}

const ProductAllList: React.FC<ProductAllListProps> = memo(function AllCards({
  loading,
  loadingMore,
  isError,
  cards,
  onFavoritePress,
  onFetchMore,
  onRetry,
}) {
  const [search] = useSearchVar();
  const { getIsFavorite } = useFavorites();

  return (
    <FlatList
      testID="merged-product-list"
      showsVerticalScrollIndicator={false}
      data={cards}
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
                  ? renderTitleHighlight(edge.node?.title ?? '', search.query)
                  : (edge.node?.title ?? '')
              }
              subtitle={edge.node?.seller_username ?? ''}
              date={edge.node.created_at ?? new Date().toISOString()}
              currency={edge.node?.currency}
              price={edge.node?.start_price}
              highestBidCurrency={edge.node?.highest_bid_currency}
              highestBidPrice={edge.node?.highest_bid_price}
              marketCurrency={edge.node?.last_sold_currency}
              marketPrice={edge.node?.last_sold_price}
              lastSoldIsChecked={edge.node?.last_sold_is_checked ?? false}
              lastSoldIsCorrect={edge.node?.last_sold_is_correct ?? false}
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
                getIsFavorite(edge.node?.id) ? getColor('red-600') : undefined
              }
              rightIconSize={22}
              onRightIconPress={() => {
                onFavoritePress(edge.node?.id, getIsFavorite(edge.node?.id));
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
                ? renderTitleHighlight(edge.node?.title ?? '', search.query)
                : (edge.node?.title ?? '')
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
        loading || loadingMore ? (
          <Row className={classes.loadingRow}>
            <ActivityIndicator size="small" color={getColor('primary-500')} />
            <Label className={classes.footerText}>
              {loading ? 'Loading...' : 'Load more...'}
            </Label>
          </Row>
        ) : isError && cards.length === 0 ? (
          <View className={classes.errorContainer}>
            <Label className={classes.footerText}>Failed to fetch.</Label>
            <Button
              variant="primary-light"
              size="small"
              disabled={loading || loadingMore}
              onPress={onRetry}
              className={classes.retryButton}
            >
              Retry
            </Button>
          </View>
        ) : null
      }
      onEndReached={onFetchMore}
      onEndReachedThreshold={3}
    />
  );
});

const classes = {
  loadingContainer: 'flex-1 flex-row items-center justify-center gap-2',
  loadingText: 'text-center',
  listContentContainer: 'gap-4 p-4.5',
  errorContainer: 'py-4 items-center justify-center gap-10',
  loadingRow: 'py-4 items-center justify-center gap-2',
  footerText: 'text-gray-500',
  retryButton: '!min-w-28',
};

export default ProductAllList;
