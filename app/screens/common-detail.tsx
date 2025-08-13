import React, { useCallback, useMemo, useRef, useState } from 'react';

import { clsx } from 'clsx';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { cssInterop } from 'nativewind';
import { Alert, ScrollView, TouchableOpacity, View } from 'react-native';

import {
  BottomSheetModal,
  ContextMenu,
  Divider,
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
  useCreateFavoritesMutation,
  useGetVwChaamoDetailQuery,
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

  const dotsRef = useRef<View>(null);
  const [isContextMenuVisible, setIsContextMenuVisible] = useState(false);

  const { id, preview } = useLocalSearchParams();
  const { data } = useGetVwChaamoDetailQuery({
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

  const rightIconHeader = useMemo(() => {
    if (isSeller) {
      return 'dots-vertical';
    }
    return getIsFavorite(id as string) ? 'heart' : 'heart-outline';
  }, [isSeller, id, getIsFavorite]);

  const rightIconColor = useMemo(() => {
    if (isSeller) {
      return getColor('gray-600');
    }
    return getColor(getIsFavorite(id as string) ? 'red-500' : 'gray-600');
  }, [id, getIsFavorite, isSeller]);

  const onRightPress = useCallback(() => {
    if (isSeller) {
      setIsContextMenuVisible(true);
    } else {
      handleToggleFavorite();
    }
  }, [handleToggleFavorite, isSeller]);

  const handleBoostPost = useCallback(() => {
    router.push({
      pathname: '/screens/select-ad-package',
      params: { listingId: detail?.id },
    });
    setIsContextMenuVisible(false);
  }, [detail?.id]);

  const handleEditDetails = useCallback(() => {
    router.push({
      pathname: '/screens/sell',
      params: { cardId: detail?.id },
    });
    setIsContextMenuVisible(false);
  }, [detail?.id]);

  const handleDelete = useCallback(() => {
    setIsContextMenuVisible(false);
    Alert.alert(
      'Are you sure you want to delete this card?',
      'This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Coming soon');
          },
        },
      ],
    );
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
          rightIcon={rightIconHeader}
          rightIconColor={rightIconColor}
          rightIconSize={28}
          onRightPress={onRightPress}
          rightRef={dotsRef}
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
          price={formatDisplay(detail?.currency, detail?.start_price ?? 0)}
          date={detail?.created_at ?? new Date().toISOString()}
          title={detail?.name ?? ''}
          marketPrice={formatDisplay(detail?.currency, 0)}
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
      <ContextMenu
        visible={isContextMenuVisible}
        onClose={() => setIsContextMenuVisible(false)}
        triggerRef={dotsRef}
        menuHeight={60}
      >
        <TouchableOpacity
          onPress={handleBoostPost}
          className={classes.contextMenu}
        >
          <Label className={classes.contextMenuText}>Boost Post</Label>
        </TouchableOpacity>
        <Divider position="horizontal" />
        <TouchableOpacity
          onPress={handleEditDetails}
          className={classes.contextMenu}
        >
          <Label className={classes.contextMenuText}>Edit Details</Label>
        </TouchableOpacity>
        <Divider position="horizontal" />
        <TouchableOpacity
          onPress={handleDelete}
          className={classes.contextMenu}
        >
          <Label className={classes.deleteText}>Delete</Label>
        </TouchableOpacity>
      </ContextMenu>
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
  contextMenu: 'flex-row items-center py-2 px-3 gap-2',
  contextMenuText: 'text-sm',
  deleteText: 'text-sm text-red-500',
};
