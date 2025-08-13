import { memo } from 'react';

import { router } from 'expo-router';
import { cssInterop } from 'nativewind';
import { ActivityIndicator, FlatList, View } from 'react-native';

import { Label } from '@/components/atoms';
import { CardItem } from '@/components/molecules';
import { GetVwChaamoListingsQuery, ListingType } from '@/generated/graphql';
import { useFavorites } from '@/hooks/useFavorites';
import { DeepGet } from '@/types/helper';
import { getColor } from '@/utils/getColor';
import { getIndicator } from '@/utils/getIndicator';

cssInterop(FlatList, {
  contentContainerClassName: {
    target: 'contentContainerStyle',
  },
});

interface ProductAuctionListProps {
  loading: boolean;
  cards: DeepGet<
    GetVwChaamoListingsQuery,
    ['vw_chaamo_cardsCollection', 'edges']
  >;
  onFavoritePress: (listingId: string, isFavorite: boolean) => void;
}

const ProductAuctionList: React.FC<ProductAuctionListProps> = memo(
  function ProductAuctionList({ loading, cards, onFavoritePress }) {
    const { getIsFavorite } = useFavorites();

    if (loading) {
      return (
        <View className={classes.loadingContainer}>
          <ActivityIndicator color={getColor('primary-500')} />
          <Label className={classes.loadingText}>Loading...</Label>
        </View>
      );
    }

    return (
      <FlatList
        testID="product-auction-list"
        showsVerticalScrollIndicator={false}
        data={cards}
        keyExtractor={(item) => item.node.id}
        renderItem={({ item }) => (
          <CardItem
            listingType={item.node?.listing_type ?? ListingType.AUCTION}
            imageUrl={item.node?.image_url ?? ''}
            title={item.node?.name ?? ''}
            subtitle={item.node?.seller_username ?? ''}
            date={item.node.created_at ?? new Date().toISOString()}
            currency={item.node?.currency}
            price={item.node?.start_price}
            marketCurrency={item.node?.last_sold_currency}
            marketPrice={item.node?.last_sold_price}
            indicator={getIndicator(
              item.node?.start_price,
              item.node?.last_sold_price,
            )}
            onPress={() =>
              router.push({
                pathname: '/screens/listing-detail',
                params: {
                  id: item.node?.id,
                },
              })
            }
            rightIcon={getIsFavorite(item.node?.id) ? 'heart' : 'heart-outline'}
            rightIconColor={
              getIsFavorite(item.node?.id) ? getColor('red-600') : undefined
            }
            rightIconSize={22}
            onRightIconPress={() => {
              onFavoritePress(item.node?.id, getIsFavorite(item.node?.id));
            }}
          />
        )}
        contentContainerClassName={classes.contentContainer}
      />
    );
  },
);

const classes = {
  loadingContainer: 'flex-1 flex-row items-center justify-center gap-2',
  loadingText: 'text-center',
  contentContainer: 'gap-4 py-4.5',
};

export default ProductAuctionList;
