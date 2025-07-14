import React, { useCallback, useState } from 'react';

import { clsx } from 'clsx';
import { router } from 'expo-router';
import { cssInterop } from 'nativewind';
import { ScrollView, TouchableOpacity, View } from 'react-native';

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
import { dummyAuctionDetail, dummyPortfolioValueData } from '@/constants/dummy';
import { getColor } from '@/utils/getColor';

cssInterop(ScrollView, {
  contentContainerClassName: {
    target: 'contentContainerStyle',
  },
});

export default function ProductDetailScreen() {
  const card = dummyAuctionDetail;

  const [showModal, setShowModal] = useState(false);

  const handleToggleFavorite = useCallback(() => {
    console.log('toggle favorite');
  }, []);

  const handleBuyNow = useCallback(() => {
    setShowModal(true);
  }, []);

  const handleMakeAnOffer = useCallback(() => {}, []);

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
          rightIcon="heart-outline"
          rightIconColor={getColor('gray-600')}
          rightIconSize={28}
          onRightPress={handleToggleFavorite}
        />
        <View className={classes.cardImageWrapper}>
          <View className={classes.cardImage}>
            <Icon name="cards-outline" size={64} color={getColor('gray-400')} />
          </View>
        </View>
        <ProductDetailInfo
          price={card.currentPrice}
          date={card.date}
          title={card.title}
          marketPrice={card.bidPrice}
          description={card.description}
          indicator="down"
        />
        <View className={classes.chartWrapper}>
          <Chart data={dummyPortfolioValueData} />
        </View>
        <ListedByList />
        <TouchableOpacity className={classes.reportButton}>
          <Icon name="flag" size={18} />
          <Label variant="subtitle">Report this Ad</Label>
        </TouchableOpacity>
        <SimilarAdList />
      </ScrollView>
      <ProductDetailBottomBar
        showModal={showModal}
        onBuyNowPress={handleBuyNow}
        onMakeAnOfferPress={handleMakeAnOffer}
      />
      <BottomSheetModal
        show={showModal}
        onDismiss={() => setShowModal(false)}
        className={classes.bottomSheet}
        height={230}
      >
        <PlaceOfferModalContent />
      </BottomSheetModal>
    </ScreenContainer>
  );
}

const classes = {
  containerBottom: 'bg-white',
  containerBottomPrimary: 'bg-primary-500',
  header: '!bg-transparent',
  scrollView: 'gap-4.5 pb-20',
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
