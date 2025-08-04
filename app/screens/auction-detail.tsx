import React, { useCallback, useMemo } from 'react';

import { Image } from 'expo-image';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { cssInterop } from 'nativewind';
import { ScrollView, TouchableOpacity, View } from 'react-native';

import {
  BottomSheetModal,
  Icon,
  Label,
  ScreenContainer,
} from '@/components/atoms';
import { Chart, Header, ProductDetailInfo } from '@/components/molecules';
import AuctionBottomBar from '@/components/molecules/AuctionDetailBottomBar';
import PlaceBidModalContent from '@/components/molecules/PlaceBidModalContent';
import { ListedByList, SimilarAdList } from '@/components/organisms';
import { dummyPortfolioValueData } from '@/constants/dummy';
import {
  ListingType,
  useGetVwAuctionDetailQuery,
  useInsertFavoritesMutation,
  useRemoveFavoritesMutation,
} from '@/generated/graphql';
import { useCurrencyDisplay } from '@/hooks/useCurrencyDisplay';
import { useUserVar } from '@/hooks/useUserVar';
import { getColor } from '@/utils/getColor';

cssInterop(ScrollView, {
  contentContainerClassName: {
    target: 'contentContainerStyle',
  },
});

export default function AuctionDetailScreen() {
  const [user] = useUserVar();
  const { formatDisplay } = useCurrencyDisplay();

  const { id, isFavorite } = useLocalSearchParams();
  const { data } = useGetVwAuctionDetailQuery({
    skip: !id,
    variables: {
      filter: {
        id: { eq: id },
      },
    },
  });
  const [insertFavorites] = useInsertFavoritesMutation();
  const [removeFavorites] = useRemoveFavoritesMutation();

  const [showModal, setShowModal] = React.useState(false);
  const [isFavoriteState, setIsFavoriteState] = React.useState(false);

  const detail = useMemo(
    () => data?.vw_chaamo_cardsCollection?.edges?.[0]?.node,
    [data],
  );

  const handleToggleFavorite = useCallback(() => {
    if (isFavoriteState) {
      removeFavorites({
        variables: {
          filter: {
            user_id: { eq: user?.id },
            listing_id: { eq: id },
          },
        },
        onCompleted: () => {
          setIsFavoriteState(false);
        },
      });
    } else {
      insertFavorites({
        variables: {
          objects: [
            {
              user_id: user?.id,
              listing_id: id,
            },
          ],
        },
        onCompleted: () => {
          setIsFavoriteState(true);
        },
      });
    }
  }, [id, insertFavorites, isFavoriteState, user?.id, removeFavorites]);

  const handleReport = useCallback(() => {
    router.push({
      pathname: '/screens/report',
      params: { listingId: detail?.id, userId: detail?.seller_id },
    });
  }, [detail?.id, detail?.seller_id]);

  const handleBidNow = useCallback(() => {
    setShowModal(true);
  }, []);

  useFocusEffect(
    useCallback(() => {
      setIsFavoriteState(isFavorite === 'true');
    }, [isFavorite]),
  );

  return (
    <ScreenContainer classNameBottom={classes.containerBottom}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName={classes.scrollView}
        stickyHeaderIndices={[0]}
      >
        <Header
          onBackPress={() => router.back()}
          className={classes.header}
          rightIcon={isFavoriteState ? 'heart' : 'heart-outline'}
          rightIconColor={getColor(isFavoriteState ? 'red-500' : 'gray-600')}
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
          price={formatDisplay(detail?.currency, detail?.start_price)}
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
          listingType={ListingType.AUCTION}
        />
      </ScrollView>
      <AuctionBottomBar
        showModal={showModal}
        endDate={detail?.ends_at ?? new Date()}
        onBidNowPress={handleBidNow}
      />
      <BottomSheetModal
        show={showModal}
        onDismiss={() => setShowModal(false)}
        className={classes.bottomSheet}
        height={440}
      >
        <PlaceBidModalContent
          id={detail?.id ?? ''}
          endDate={detail?.ends_at ?? new Date()}
          onDismiss={() => setShowModal(false)}
        />
      </BottomSheetModal>
    </ScreenContainer>
  );
}

const classes = {
  containerBottom: 'bg-primary-500',
  header: '!bg-transparent',
  scrollView: 'gap-4.5 pb-36',
  cardImageWrapper: 'items-center',
  cardImage:
    'w-56 aspect-[7/10] rounded-lg border border-gray-200 bg-gray-200 items-center justify-center',
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
  bottomSheet: 'bg-primary-500 pb-4.5',
};
