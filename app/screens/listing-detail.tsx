import React, { useCallback, useMemo, useRef, useState } from 'react';

import { clsx } from 'clsx';
import { Image as ExpoImage } from 'expo-image';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { cssInterop } from 'nativewind';
import {
  Alert,
  Modal as RNModal,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';

import {
  BottomSheetModal,
  Button,
  ContextMenu,
  Divider,
  Icon,
  Label,
  Modal,
  ScreenContainer,
} from '@/components/atoms';
import {
  AuctionDetailBottomBar,
  Chart,
  Header,
  PlaceBidModalContent,
  PlaceOfferModalContent,
  ProductDetailBottomBar,
  ProductDetailInfo,
} from '@/components/molecules';
import { ListedByList, SimilarAdList } from '@/components/organisms';
import { dummyPortfolioValueData } from '@/constants/dummy';
import {
  ListingType,
  useCreateFavoritesMutation,
  useDeleteUserCardMutation,
  useGetVwChaamoDetailLazyQuery,
  useRemoveFavoritesMutation,
} from '@/generated/graphql';
import { useCurrencyDisplay } from '@/hooks/useCurrencyDisplay';
import { useFavorites } from '@/hooks/useFavorites';
import { useUserVar } from '@/hooks/useUserVar';
import { getColor } from '@/utils/getColor';
import { getIndicator } from '@/utils/getIndicator';

cssInterop(ScrollView, {
  contentContainerClassName: {
    target: 'contentContainerStyle',
  },
});

export default function ListingDetailScreen() {
  const [user] = useUserVar();
  const { getIsFavorite } = useFavorites();
  const { formatDisplay, formatPrice } = useCurrencyDisplay();
  const [isDeletePopupVisible, setIsDeletePopupVisible] = useState(false);

  const dotsRef = useRef<View>(null);
  const [isContextMenuVisible, setIsContextMenuVisible] = useState(false);

  const { id, preview } = useLocalSearchParams();
  const [getDetail, { data }] = useGetVwChaamoDetailLazyQuery({
    fetchPolicy: 'cache-and-network',
  });
  const [createFavorites] = useCreateFavoritesMutation();
  const [removeFavorites] = useRemoveFavoritesMutation();
  const [deleteUserCard, { loading: isDeleting }] = useDeleteUserCardMutation();

  const [showModal, setShowModal] = useState(false);
  const [showImageZoom, setShowImageZoom] = useState(false);

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

  const handleShowModal = useCallback(() => {
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
      params: { listingId: detail?.user_card_id },
    });
    setIsContextMenuVisible(false);
  }, [detail?.user_card_id]);

  const handleEditDetails = useCallback(() => {
    router.push({
      pathname: '/screens/sell',
      params: { cardId: detail?.user_card_id },
    });
    setIsContextMenuVisible(false);
  }, [detail?.user_card_id]);

  const handleDeletePopup = useCallback(() => {
    setIsContextMenuVisible(false);
    setIsDeletePopupVisible(!isDeletePopupVisible);
  }, [isDeletePopupVisible]);

  const handleDeleteAccount = useCallback(() => {
    deleteUserCard({
      variables: {
        filter: {
          id: { eq: detail?.user_card_id },
        },
      },
      onCompleted: ({ deleteFromuser_cardsCollection }) => {
        if (deleteFromuser_cardsCollection?.records?.length) {
          Alert.alert('Success', 'Your post has been deleted', [
            {
              text: 'OK',
              onPress: () => {
                router.replace('/(tabs)/profile');
                handleDeletePopup();
              },
            },
          ]);
        }
      },
      onError: (error) => {
        console.log(error);
      },
    });
  }, [deleteUserCard, detail?.user_card_id, handleDeletePopup]);

  useFocusEffect(
    useCallback(() => {
      if (id) {
        getDetail({
          variables: {
            filter: {
              id: { eq: id },
            },
          },
        });
      }
    }, [getDetail, id]),
  );

  const renderBottomBar = useCallback(() => {
    if (isSeller) {
      return null;
    }

    if (detail?.listing_type === ListingType.AUCTION) {
      return (
        <>
          <AuctionDetailBottomBar
            showModal={showModal}
            highestBidPrice={formatDisplay(
              detail?.highest_bid_currency,
              detail?.highest_bid_price ?? detail?.reserve_price ?? 0,
            )}
            endDate={detail?.end_time ?? new Date()}
            onBidNowPress={handleShowModal}
          />
          <BottomSheetModal
            show={showModal}
            onDismiss={() => setShowModal(false)}
            className={classes.bottomSheet}
            height={400}
          >
            <PlaceBidModalContent
              id={detail?.id ?? ''}
              sellerId={detail?.seller_id ?? ''}
              minimumBidAmount={String(
                formatPrice(detail?.currency, detail?.reserve_price ?? 0),
              )}
              currentBidAmount={String(
                formatPrice(
                  detail?.highest_bid_currency,
                  detail?.highest_bid_price ?? detail?.reserve_price ?? 0,
                ),
              )}
              endDate={detail?.end_time ?? new Date()}
              onDismiss={() => setShowModal(false)}
            />
          </BottomSheetModal>
        </>
      );
    } else if (detail?.listing_type === ListingType.SELL) {
      return (
        <>
          <ProductDetailBottomBar
            showModal={showModal}
            onBuyNowPress={handleBuyNow}
            onMakeAnOfferPress={handleShowModal}
          />
          <BottomSheetModal
            show={showModal}
            onDismiss={() => setShowModal(false)}
            className={classes.bottomSheet}
            height={240}
          >
            <PlaceOfferModalContent
              id={detail?.id ?? ''}
              sellerId={detail?.seller_id ?? ''}
              onDismiss={() => setShowModal(false)}
            />
          </BottomSheetModal>
        </>
      );
    }
  }, [
    isSeller,
    detail?.listing_type,
    detail?.highest_bid_currency,
    detail?.highest_bid_price,
    detail?.reserve_price,
    detail?.end_time,
    detail?.id,
    detail?.currency,
    detail?.seller_id,
    showModal,
    formatDisplay,
    formatPrice,
    handleShowModal,
    handleBuyNow,
  ]);

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
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => setShowImageZoom(true)}
            >
              <ExpoImage
                source={{ uri: detail.image_url }}
                className={classes.cardImage}
                contentFit="cover"
                transition={200}
              />
            </TouchableOpacity>
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

        {detail?.image_url && (
          <RNModal visible={showImageZoom} transparent={true}>
            <ImageViewer
              imageUrls={[{ url: detail.image_url }]}
              onSwipeDown={() => setShowImageZoom(false)}
              enableImageZoom={true}
              enableSwipeDown={true}
              renderHeader={() => (
                <TouchableOpacity
                  onPress={() => setShowImageZoom(false)}
                  className={classes.closeButton}
                >
                  <Icon name="close" size={24} color="white" />
                </TouchableOpacity>
              )}
              backgroundColor="rgba(0,0,0,0.9)"
              renderIndicator={() => <></>}
            />
          </RNModal>
        )}
        <ProductDetailInfo
          price={formatDisplay(detail?.currency, detail?.start_price ?? 0)}
          date={detail?.created_at ?? new Date().toISOString()}
          title={detail?.name ?? ''}
          listingId={detail?.id ?? ''}
          sellerId={detail?.seller_id ?? ''}
          lastSoldIsChecked={detail?.last_sold_is_checked ?? false}
          marketPrice={formatDisplay(
            detail?.last_sold_currency,
            detail?.last_sold_price,
          )}
          indicator={getIndicator(detail?.start_price, detail?.last_sold_price)}
          description={detail?.description ?? ''}
        />
        <View className={classes.chartWrapper}>
          <Chart data={dummyPortfolioValueData} />
        </View>
        <ListedByList
          listingId={detail?.id ?? ''}
          userId={detail?.seller_id ?? ''}
          imageUrl={detail?.seller_image_url ?? ''}
          username={detail?.seller_username ?? ''}
        />
        {!isSeller && (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleReport}
            className={classes.reportButton}
          >
            <Icon name="flag" size={18} />

            <Label variant="subtitle">Report this Ad</Label>
          </TouchableOpacity>
        )}
        <SimilarAdList
          ignoreId={detail?.id ?? ''}
          listingType={detail?.listing_type ?? ListingType.SELL}
        />
      </ScrollView>
      {renderBottomBar()}
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
        {detail?.listing_type !== ListingType.AUCTION && (
          <>
            <Divider position="horizontal" />
            <TouchableOpacity
              onPress={handleEditDetails}
              className={classes.contextMenu}
            >
              <Label className={classes.contextMenuText}>Edit Details</Label>
            </TouchableOpacity>
            <Divider position="horizontal" />
            <TouchableOpacity
              onPress={handleDeletePopup}
              className={classes.contextMenu}
            >
              <Label className={classes.deleteText}>Delete</Label>
            </TouchableOpacity>
          </>
        )}
      </ContextMenu>
      <Modal
        visible={isDeletePopupVisible}
        onClose={handleDeletePopup}
        className={classes.deleteAccountModal}
      >
        <Label className={classes.deleteAccountModalTitle}>
          Delete this post?
        </Label>
        <Label className={classes.deleteAccountModalDescription}>
          Are you sure you want to delete this post. It will be deleted
          permanently and can not be resorted.
        </Label>
        <Divider position="horizontal" />
        <Button
          variant="ghost"
          className={classes.deleteAccountModalButton}
          textClassName={classes.deleteAccountModalButtonText}
          loading={isDeleting}
          disabled={isDeleting}
          onPress={handleDeleteAccount}
        >
          Delete
        </Button>
        <Divider position="horizontal" />
        <Button
          variant="ghost"
          onPress={handleDeletePopup}
          disabled={isDeleting}
        >
          Cancel
        </Button>
      </Modal>
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
  deleteAccountModal: 'mx-14 items-center pt-5',
  deleteAccountModalTitle: 'text-lg font-bold text-slate-900',
  deleteAccountModalDescription:
    'text-md text-slate-600 text-center mx-16 mt-4 mb-8',
  deleteAccountModalButton: 'text-red-500',
  deleteAccountModalButtonText: 'text-red-700',
  closeButton: 'absolute top-10 right-5 z-10 bg-black/50 rounded-full p-2',
};
