import React, { useCallback, useMemo, useRef, useState } from 'react';

import { clsx } from 'clsx';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { cssInterop } from 'nativewind';
import {
  Alert,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';

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
  ImageGallery,
  PlaceBidModalContent,
  PlaceOfferModalContent,
  ProductDetailBottomBar,
  ProductDetailInfo,
} from '@/components/molecules';
import { ListedByList, SimilarAdList } from '@/components/organisms';
import { dummyPortfolioValueData } from '@/constants/dummy';
import { BaseEbayPost } from '@/domains/ebay_post.types';
import {
  ListingType,
  useCreateFavoritesMutation,
  useDeleteEbayPostsMutation,
  useDeleteUserCardMutation,
  useGetVwChaamoDetailLazyQuery,
  useRemoveFavoritesMutation,
  useGetEbayPostDetailLazyQuery,
} from '@/generated/graphql';
import { useCurrencyDisplay } from '@/hooks/useCurrencyDisplay';
import { useFavorites } from '@/hooks/useFavorites';
import { useUserVar } from '@/hooks/useUserVar';
import { cache } from '@/utils/apollo';
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
  const { id, ebay } = useLocalSearchParams<{ id?: string; ebay?: string }>();

  const [isDeletePopupVisible, setIsDeletePopupVisible] = useState(false);
  const [isContextMenuVisible, setIsContextMenuVisible] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const dotsRef = useRef<View>(null);

  const [getDetail, { data, refetch: refetchDetail }] =
    useGetVwChaamoDetailLazyQuery({
      fetchPolicy: 'cache-and-network',
    });
  const [getEbayPost, { data: ebayData, refetch: refetchEbayPost }] =
    useGetEbayPostDetailLazyQuery({
      fetchPolicy: 'cache-and-network',
    });
  const [createFavorites] = useCreateFavoritesMutation();
  const [removeFavorites] = useRemoveFavoritesMutation();
  const [deleteUserCard, { loading: isDeleting }] = useDeleteUserCardMutation();
  const [deleteEbayPost] = useDeleteEbayPostsMutation();

  const chaamoDetail = useMemo(
    () => data?.vw_chaamo_cardsCollection?.edges?.[0]?.node,
    [data],
  );
  const isEbay = useMemo(() => ebay === 'true', [ebay]);

  const detail = useMemo(() => {
    if (isEbay) {
      const ebayNode = ebayData?.ebay_postsCollection?.edges?.[0]?.node;
      if (!ebayNode) return undefined;
      return {
        id: ebayNode.id,
        listing_type: ListingType.SELL,
        image_url: ebayNode.image_hd_url ?? '',
        name: ebayNode.name ?? '',
        currency: ebayNode.currency ?? undefined,
        start_price: ebayNode.price ?? undefined,
        created_at: ebayNode.sold_at ?? new Date().toISOString(),
        seller_id: '',
        last_sold_currency: undefined,
        last_sold_price: undefined,
        last_sold_is_checked: false,
        description: '',
        seller_image_url: '',
        seller_username: '',
        highest_bid_currency: undefined,
        highest_bid_price: undefined,
        reserve_price: undefined,
        end_time: undefined,
        user_card_id: undefined,
      } as const;
    }
    return chaamoDetail;
  }, [chaamoDetail, ebayData, isEbay]);

  const imageUrls = useMemo(() => {
    if (isEbay) {
      const ebayDetail = detail as { image_url?: string };
      return ebayDetail?.image_url || null;
    }
    const chaamoDetail = detail as { image_urls?: string | string[] };
    return chaamoDetail?.image_urls || null;
  }, [detail, isEbay]);

  const isSeller = useMemo(
    () => (isEbay ? false : user?.id === detail?.seller_id),
    [detail?.seller_id, user?.id, isEbay],
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
    if (ebay || isSeller) {
      return 'dots-vertical';
    }
    return getIsFavorite(id as string) ? 'heart' : 'heart-outline';
  }, [ebay, isSeller, getIsFavorite, id]);

  const rightIconColor = useMemo(() => {
    if (ebay || isSeller) {
      return getColor('gray-600');
    }
    return getColor(getIsFavorite(id as string) ? 'red-500' : 'gray-600');
  }, [ebay, isSeller, getIsFavorite, id]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      if (isEbay) {
        await refetchEbayPost?.();
      } else {
        await refetchDetail?.();
      }
    } finally {
      setRefreshing(false);
    }
  }, [isEbay, refetchDetail, refetchEbayPost]);

  const onRightPress = useCallback(() => {
    if (ebay || isSeller) {
      setIsContextMenuVisible(true);
    } else {
      handleToggleFavorite();
    }
  }, [ebay, isSeller, handleToggleFavorite]);

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

  const handleDeleteEbayCard = useCallback(() => {
    deleteEbayPost({
      variables: {
        filter: {
          id: { eq: id as string },
        },
      },
      onCompleted: ({ deleteFromebay_postsCollection }) => {
        if (deleteFromebay_postsCollection?.records?.length) {
          handleDeletePopup();
          cache.modify({
            fields: {
              ebay_postsCollection(prev) {
                return prev?.edges?.filter(
                  (item: BaseEbayPost) => item.id !== id,
                );
              },
            },
          });
          Alert.alert('Success', 'the card has been deleted', [
            {
              text: 'OK',
              onPress: () => {
                router.back();
              },
            },
          ]);
        }
      },
    });
  }, [deleteEbayPost, id, handleDeletePopup]);

  const handleDeleteChaamoCard = useCallback(() => {
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

  const handleDeleteCard = useCallback(() => {
    if (id) return handleDeleteEbayCard();
    return handleDeleteChaamoCard();
  }, [handleDeleteChaamoCard, handleDeleteEbayCard, id]);

  useFocusEffect(
    useCallback(() => {
      if (!id) return;
      if (ebay === 'true') {
        getEbayPost({
          variables: {
            filter: {
              id: { eq: id as string },
            },
          },
        });
      } else {
        getDetail({
          variables: {
            filter: {
              id: { eq: id },
            },
          },
        });
      }
    }, [getDetail, getEbayPost, id, ebay]),
  );

  const renderBottomBar = useCallback(() => {
    if (isSeller) return null;

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
    }

    if (detail?.listing_type === ListingType.SELL) {
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
      <Header
        onBackPress={() => router.back()}
        className={classes.header}
        rightIcon={rightIconHeader}
        rightIconColor={rightIconColor}
        rightIconSize={28}
        onRightPress={onRightPress}
        rightRef={dotsRef}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName={classes.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        <View className={classes.cardImageWrapper}>
          <ImageGallery
            imageUrls={imageUrls}
            imageClassName={classes.cardImage}
            showIndicators={true}
          />
        </View>

        <ProductDetailInfo
          isEbay={isEbay}
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
          userCardId={detail?.user_card_id ?? ''}
          refetch={ebay ? refetchEbayPost : refetchDetail}
        />
        <View className={classes.chartWrapper}>
          <Chart data={dummyPortfolioValueData} />
        </View>
        {!isEbay && (
          <ListedByList
            listingId={detail?.id ?? ''}
            userId={detail?.seller_id ?? ''}
            imageUrl={detail?.seller_image_url ?? ''}
            username={detail?.seller_username ?? ''}
          />
        )}
        {!isSeller && !isEbay && (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleReport}
            className={classes.reportButton}
          >
            <Icon name="flag" size={18} />

            <Label variant="subtitle">Report this Ad</Label>
          </TouchableOpacity>
        )}
        {!isEbay && (
          <SimilarAdList
            ignoreId={detail?.id ?? ''}
            listingType={detail?.listing_type ?? ListingType.SELL}
          />
        )}
      </ScrollView>
      {!isEbay && renderBottomBar()}
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
            {!ebay && (
              <>
                <Divider position="horizontal" />
                <TouchableOpacity
                  onPress={handleEditDetails}
                  className={classes.contextMenu}
                >
                  <Label className={classes.contextMenuText}>
                    Edit Details
                  </Label>
                </TouchableOpacity>
                <Divider position="horizontal" />
              </>
            )}
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
          onPress={handleDeleteCard}
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
