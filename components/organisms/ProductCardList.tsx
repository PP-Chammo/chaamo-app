import { memo } from 'react';

import { router } from 'expo-router';
import { cssInterop } from 'nativewind';
import { ActivityIndicator, FlatList, View } from 'react-native';

import { CardItem } from '@/components/molecules';
import { GetVwChaamoListingsQuery, ListingType } from '@/generated/graphql';
import { useCurrencyDisplay } from '@/hooks/useCurrencyDisplay';
import { DeepGet } from '@/types/helper';
import { getColor } from '@/utils/getColor';

cssInterop(FlatList, {
  contentContainerClassName: {
    target: 'contentContainerStyle',
  },
});

interface ProductCardListProps {
  loading: boolean;
  cards: DeepGet<
    GetVwChaamoListingsQuery,
    ['vw_chaamo_cardsCollection', 'edges']
  >;
  onFavoritePress: (listingId: string, isFavorite: boolean) => void;
}

const ProductCardList: React.FC<ProductCardListProps> = memo(function AllCards({
  loading,
  cards,
  onFavoritePress,
}) {
  const { formatDisplay } = useCurrencyDisplay();

  if (loading) {
    return (
      <View className={classes.loadinContainer}>
        <ActivityIndicator size="large" color={getColor('primary-500')} />
      </View>
    );
  }

  return (
    <FlatList
      testID="product-card-list"
      showsVerticalScrollIndicator={false}
      data={cards}
      keyExtractor={(item) => item.node.id}
      renderItem={({ item }) => (
        <CardItem
          listingType={item.node?.listing_type ?? ListingType.SELL}
          imageUrl={item.node?.image_url ?? ''}
          title={item.node?.name ?? ''}
          subtitle={item.node?.seller_username ?? ''}
          price={formatDisplay(
            item.node?.currency,
            item.node.listing_type === ListingType.SELL
              ? item.node?.price
              : item.node?.start_price,
          )}
          date={item.node.created_at ?? new Date().toISOString()}
          marketPrice={formatDisplay(item.node?.currency, 0)}
          marketType="eBay"
          indicator="up"
          onPress={() =>
            router.push({
              pathname:
                item.node?.listing_type === ListingType.AUCTION
                  ? '/screens/auction-detail'
                  : '/screens/common-detail',
              params: {
                id: item.node?.id,
                isFavorite: String(item.node?.is_favorite),
              },
            })
          }
          rightIcon={item.node?.is_favorite ? 'heart' : 'heart-outline'}
          rightIconColor={
            item.node?.is_favorite ? getColor('red-600') : undefined
          }
          rightIconSize={22}
          onRightIconPress={() => {
            onFavoritePress(item.node?.id, item.node?.is_favorite ?? false);
          }}
        />
      )}
      contentContainerClassName={classes.contentContainer}
    />
  );
});

const classes = {
  loadinContainer: 'flex-1 items-center justify-center',
  contentContainer: 'gap-4 py-4.5',
};

export default ProductCardList;
