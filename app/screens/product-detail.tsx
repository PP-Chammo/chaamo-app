import React from 'react';

import { clsx } from 'clsx';
import { formatDistanceToNow } from 'date-fns';
import { router } from 'expo-router';
import { cssInterop } from 'nativewind';
import { ScrollView, View, TouchableOpacity } from 'react-native';

import EBayImage from '@/assets/svg/ebay.svg';
import {
  Icon,
  Label,
  ScreenContainer,
  Row,
  Button,
  BottomSheetModal,
} from '@/components/atoms';
import {
  Chart,
  CommonCard,
  Header,
  ListContainer,
  People,
} from '@/components/molecules';
import {
  dummyPortfolioValueData,
  dummyAuctionDetail,
  dummyFeaturedCardList,
} from '@/constants/dummy';
import { getColor } from '@/utils/getColor';

cssInterop(ScrollView, {
  contentContainerClassName: {
    target: 'contentContainerStyle',
  },
});

export default function AuctionDetailScreen() {
  const card = dummyAuctionDetail;

  const [showModal, setShowModal] = React.useState(false);

  const handleToggleFavorite = React.useCallback(() => {
    console.log('toggle favorite');
  }, []);

  const handleBidNow = React.useCallback(() => {
    // TODO: Implement bid logic/modal
    console.log('Bid Now pressed');
    setShowModal(true);
  }, []);

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
        <View className={classes.cardInfoWrapper}>
          <View className={classes.priceRow}>
            <Label variant="subtitle" className={classes.price}>
              {card.currentPrice}
            </Label>
            <Row className={classes.dateRow}>
              <Icon
                name="calendar"
                variant="SimpleLineIcons"
                size={12}
                color={getColor('gray-400')}
              />
              <Label className={classes.date}>
                {formatDistanceToNow(new Date(card.date), { addSuffix: true })}
              </Label>
            </Row>
          </View>
          <Label variant="subtitle" className={classes.name}>
            {card.title}
          </Label>
          <View className={classes.ebayRow}>
            <EBayImage />
            <Label className={classes.priceValueLabel}>Price Value: </Label>
            <Label className={classes.priceValue}>{card.bidPrice}</Label>
          </View>
          <View className={classes.descriptionWrapper}>
            <Label className={classes.descriptionTitle}>Description</Label>
            <Label className={classes.description}>{card.description}</Label>
          </View>
        </View>
        <View className={classes.chartWrapper}>
          <Chart data={dummyPortfolioValueData} />
        </View>
        <View className={classes.listedByWrapper}>
          <Label variant="subtitle">Listed By</Label>
          <People fullname="John Doe" onViewProfilePress={() => {}} />
        </View>
        <TouchableOpacity className={classes.reportButton}>
          <Icon name="flag" size={18} />
          <Label variant="subtitle">Report this Ad</Label>
        </TouchableOpacity>
        <ListContainer noLink title="Similar Ads" data={dummyFeaturedCardList}>
          {(item: (typeof dummyFeaturedCardList)[number]) => (
            <CommonCard
              id={item.id}
              imageUrl={item.imageUrl}
              title={item.title}
              price={item.price}
              marketPrice={item.marketPrice}
              marketType={item.marketType}
              indicator={item.indicator}
            />
          )}
        </ListContainer>
      </ScrollView>
      <View className={clsx(classes.bottomBar, { hidden: showModal })}>
        <View className={classes.timeBarInner}>
          <Label className={classes.timeText}>7d 15h</Label>
        </View>
        <View className={classes.bottomBarLeft}>
          <Label className={classes.highestBidLabel}>Highest Bid</Label>
          <Label className={classes.highestBidValue}>$400</Label>
        </View>
        <Button
          variant="light"
          className={classes.bidButton}
          textClassName={classes.bidText}
          onPress={handleBidNow}
        >
          Bid Now
        </Button>
      </View>
      <BottomSheetModal
        show={showModal}
        onDismiss={() => setShowModal(false)}
        className={classes.bottomSheet}
      >
        <Label>this is modal content</Label>
      </BottomSheetModal>
    </ScreenContainer>
  );
}

const classes = {
  containerBottom: 'bg-teal-600',
  header: '!bg-transparent',
  scrollView: 'gap-4.5 pb-32',
  cardInfoWrapper: 'px-4.5',
  cardImageWrapper: 'items-center',
  cardImage:
    'w-56 h-80 rounded-xl border border-gray-200 bg-gray-200 items-center justify-center',
  priceRow: 'flex-row items-center justify-between',
  price: 'text-teal-600 text-xl font-bold',
  date: 'text-sm text-gray-400',
  name: 'text-lg font-semibold mt-1',
  ebayRow: 'flex-row items-center mt-1 gap-1',
  descriptionWrapper: 'mt-4',
  descriptionTitle: 'text-base font-semibold mb-1',
  description: 'text-base text-gray-700',
  chartWrapper: 'px-4.5',
  priceValueLabel: 'text-sm text-gray-500',
  priceValue: 'text-sm text-gray-700 font-bold',
  contextMenuItem: 'py-2 px-3',
  contextMenuDelete: 'py-2 px-3 !text-red-900',
  contextMenuDivider: 'h-px bg-gray-200',
  dateRow: 'gap-1.5',
  listedByWrapper: 'px-4.5 gap-2',
  reportButton:
    'flex-row justify-center items-center gap-1.5 mx-4.5 py-3 border-y border-slate-200',
  reportText: 'text-white text-sm font-semibold',
  bidButton: 'border border-white rounded-full !min-w-40 !py-2',
  bidText: 'text-white',
  bottomBar:
    'z-10 absolute left-0 right-0 bottom-0 flex-row items-center px-8 py-5 bg-teal-600 z-50',
  bottomBarLeft: 'flex-1 justify-center',
  highestBidLabel: 'text-white text-lg font-semibold',
  highestBidValue: 'text-white text-2xl font-bold mt-1',
  timeBarInner:
    'absolute -top-7 left-0 right-0 bg-amber-50 py-1 flex flex-row justify-center items-center rounded-t-xl',
  timeText: 'text-sm font-bold',
  bottomSheet: 'bg-teal-600',
};
