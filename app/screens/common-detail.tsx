import React, { useCallback, useMemo, useState } from 'react';

import { clsx } from 'clsx';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { cssInterop } from 'nativewind';
import { Alert, ScrollView, TouchableOpacity, View } from 'react-native';

import {
  BottomSheetModal,
  Icon,
  Label,
  ScreenContainer,
} from '@/components/atoms';
import {
  Chart,
  Header,
  PlaceOfferModalContent,
  ProductDetailBottomBar,
  ProductDetailInfo,
} from '@/components/molecules';
import { ListedByList, SimilarAdList } from '@/components/organisms';
import { dummyPortfolioValueData } from '@/constants/dummy';
import {
  ListingType,
  useGetVwCommonDetailQuery,
  useCreateFavoritesMutation,
  useRemoveFavoritesMutation,
} from '@/generated/graphql';
import { useCurrencyDisplay } from '@/hooks/useCurrencyDisplay';
import { useFavorites } from '@/hooks/useFavorites';
import { useUserVar } from '@/hooks/useUserVar';
import { getColor } from '@/utils/getColor';

cssInterop(ScrollView, {
  contentContainerClassName: {
    target: 'contentContainerStyle',
  },
});

export default function ProductDetailScreen() {
  const [user] = useUserVar();
  const { getIsFavorite } = useFavorites();
  const { formatDisplay } = useCurrencyDisplay();

  const { id, preview } = useLocalSearchParams();
  const { data } = useGetVwCommonDetailQuery({
    skip: !id,
    variables: {
      filter: {
        id: { eq: id },
      },
    },
  });
  const [createFavorites] = useCreateFavoritesMutation();
  const [removeFavorites] = useRemoveFavoritesMutation();

  const [showModal, setShowModal] = useState(false);

  const detail = useMemo(
    () => data?.vw_chaamo_cardsCollection?.edges?.[0]?.node,
    [data],
  );

  const isSeller = useMemo(
    () => user?.id === detail?.seller_id || preview === 'true',
    [detail?.seller_id, user?.id, preview],
  );

  const handleToggleFavorite = useCallback(() => {
    if (getIsFavorite(id as string)) {
      removeFavorites({
        variables: {
          filter: {
            user_id: { eq: user?.id },
            listing_id: { eq: id },
          },
        },
      });
    } else {
      createFavorites({
        variables: {
          objects: [
            {
              user_id: user?.id,
              listing_id: id,
            },
          ],
        },
      });
    }
  }, [getIsFavorite, removeFavorites, user?.id, id, createFavorites]);

  const handleReport = useCallback(() => {
    router.push({
      pathname: '/screens/report',
      params: { listingId: detail?.id, userId: detail?.seller_id },
    });
  }, [detail?.id, detail?.seller_id]);

  const handleBuyNow = useCallback(() => {
    Alert.alert('Coming soon');
  }, []);

  const handleMakeAnOffer = useCallback(() => {
    setShowModal(true);
  }, []);

  return (
    <ScreenContainer
      classNameBottom={clsx({
        [classes.containerBottom]: !showModal,
        [classes.containerBottomPrimary]: showModal,
      })}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName={classes.scrollView}
        stickyHeaderIndices={[0]}
      >
        <Header
          onBackPress={() => router.back()}
          className={classes.header}
          rightIcon={
            getIsFavorite(detail?.id ?? '') ? 'heart' : 'heart-outline'
          }
          rightIconColor={getColor(
            getIsFavorite(detail?.id ?? '') ? 'red-500' : 'gray-600',
          )}
          rightIconSize={28}
          onRightPress={handleToggleFavorite}
        />
        <View className={classes.cardImageWrapper}>
          {detail?.image_url ? (
            <Image
              source={{ uri: detail?.image_url }}
              className={classes.cardImage}
            />
          ) : (
            <View className={classes.cardImage}>
              <Icon
                name="cards-outline"
                size={64}
                color={getColor('gray-400')}
              />
            </View>
          )}
        </View>
        <ProductDetailInfo
          price={
            detail?.listing_type === ListingType.SELL
              ? formatDisplay(detail?.currency, detail?.price)
              : undefined
          }
          date={detail?.created_at ?? new Date().toISOString()}
          title={detail?.name ?? ''}
          marketPrice={formatDisplay(
            detail?.currency,
            detail?.ebay_highest_price ?? 0,
          )}
          description={detail?.description ?? ''}
        />
        <View className={classes.chartWrapper}>
          <Chart data={dummyPortfolioValueData} />
        </View>
        <ListedByList
          userId={detail?.seller_id ?? ''}
          imageUrl={detail?.seller_image_url ?? ''}
          username={detail?.seller_username ?? ''}
        />
        {!isSeller && (
          <>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handleReport}
              className={classes.reportButton}
            >
              <Icon name="flag" size={18} />

              <Label variant="subtitle">Report this Ad</Label>
            </TouchableOpacity>
            <SimilarAdList
              ignoreListingId={detail?.id ?? ''}
              listingType={ListingType.SELL}
            />
          </>
        )}
      </ScrollView>
      {!isSeller && (
        <ProductDetailBottomBar
          showModal={showModal}
          onBuyNowPress={handleBuyNow}
          onMakeAnOfferPress={handleMakeAnOffer}
        />
      )}
      <BottomSheetModal
        show={showModal}
        onDismiss={() => setShowModal(false)}
        className={classes.bottomSheet}
        height={300}
      >
        <PlaceOfferModalContent
          id={detail?.id ?? ''}
          sellerId={detail?.seller_id ?? ''}
          onDismiss={() => setShowModal(false)}
        />
      </BottomSheetModal>
    </ScreenContainer>
  );
}

const classes = {
  containerBottom: 'bg-white mb-8',
  containerBottomPrimary: 'bg-primary-500',
  header: '!bg-transparent',
  scrollView: 'gap-4.5 pb-36',
  cardImageWrapper: 'items-center',
  cardImage:
    'w-56 h-80 rounded-xl border border-gray-200 bg-gray-200 items-center justify-center',
  chartWrapper: 'px-4.5',
  priceValueLabel: 'text-sm text-gray-500',
  priceValue: 'text-sm text-gray-700 font-bold',
  contextMenuItem: 'py-2 px-3',
  contextMenuDelete: 'py-2 px-3 !text-red-900',
  contextMenuDivider: 'h-px bg-gray-200',
  dateRow: 'gap-1.5',
  reportButton:
    'flex-row justify-center items-center gap-1.5 mx-4.5 py-3 border-y border-slate-200',
  reportText: 'text-white text-sm font-semibold',
  bidButton: 'border border-white rounded-full !min-w-40 !py-2',
  bidText: 'text-white',
  bottomBar:
    'z-10 absolute left-0 right-0 bottom-0 flex-row items-center px-8 py-5 bg-primary-500 z-50',
  bottomBarLeft: 'flex-1 justify-center',
  highestBidLabel: 'text-white text-lg font-semibold',
  highestBidValue: 'text-white text-2xl font-bold mt-1',
  timeBarInner:
    'absolute -top-7 left-0 right-0 bg-amber-50 py-1 flex flex-row justify-center items-center rounded-t-xl',
  timeText: 'text-sm font-bold',
  bottomSheet: 'bg-primary-500',
};
