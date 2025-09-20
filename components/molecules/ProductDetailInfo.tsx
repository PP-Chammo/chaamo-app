import React, { useCallback, useState } from 'react';

import { clsx } from 'clsx';
import { formatDistanceToNow } from 'date-fns';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { cssInterop } from 'nativewind';
import {
  Modal as RNModal,
  FlatList,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';

import ChaamoLogo from '@/assets/images/logo.png';
import {
  Button,
  Icon,
  Label,
  Modal,
  PriceIndicator,
  Row,
} from '@/components/atoms';
import {
  GetEbayPostsQuery,
  ListingType,
  useUpdateCardMutation,
} from '@/generated/graphql';
import { useCurrencyDisplay } from '@/hooks/useCurrencyDisplay';
import { useUserVar } from '@/hooks/useUserVar';
import { DeepGet } from '@/types/helper';

cssInterop(FlatList, {
  className: {
    target: 'className',
  },
  contentContainerClassName: {
    target: 'contentContainerStyle',
  },
});

interface ProductDetailInfoProps {
  isEbay?: boolean;
  price?: string | number;
  date: string | Date;
  title: string;
  listingType?: ListingType;
  marketPrice: string | number;
  description: string;
  indicator?: 'up' | 'down';
  listingId?: string;
  sellerId?: string;
  lastSoldIsChecked?: boolean;
  userCardId?: string;
  refetch?: () => void;
  isCorrect?: boolean;
  lastSoldList?: DeepGet<GetEbayPostsQuery, ['ebay_postsCollection', 'edges']>;
  reason?: string;
}

const ProductDetailInfo: React.FC<ProductDetailInfoProps> = ({
  isEbay,
  price,
  date,
  title,
  listingType,
  listingId,
  sellerId,
  marketPrice,
  description,
  indicator,
  lastSoldIsChecked,
  userCardId,
  refetch,
  isCorrect,
  lastSoldList,
  reason,
}) => {
  const [user] = useUserVar();
  const { formatDisplay } = useCurrencyDisplay();

  const [showLastSoldModal, setShowLastSoldModal] = useState(false);
  const [imageZoomUrl, setImageZoomUrl] = useState<string | null>(null);

  const [updateCard, { loading }] = useUpdateCardMutation();

  const handleConfirmIncorrect = useCallback(() => {
    router.push({
      pathname: '/screens/contact-us',
      params: { listingId },
    });
  }, [listingId]);

  const handleClosePriceInfo = useCallback(() => {
    updateCard({
      variables: {
        set: {
          last_sold_is_checked: true,
          last_sold_is_correct: true,
        },
        filter: {
          id: { eq: userCardId },
        },
      },
      onCompleted: ({ updatecardsCollection }) => {
        if (updatecardsCollection?.records?.length) {
          refetch?.();
        }
      },
    });
  }, [updateCard, userCardId, refetch]);

  const handleUpdateLastSoldItem = useCallback(
    (
      item: DeepGet<
        GetEbayPostsQuery,
        ['ebay_postsCollection', 'edges', number, 'node']
      >,
    ) =>
      () => {
        Alert.alert(
          'Update last sold',
          'Are you sure you want to update the last sold item?',
          [
            {
              text: 'Cancel',
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel',
            },
            {
              text: 'OK',
              onPress: () => {
                updateCard({
                  variables: {
                    set: {
                      last_sold_id: item?.id,
                      last_sold_post_url: item?.post_url,
                      last_sold_currency: item?.currency,
                      last_sold_price: item?.price,
                      last_sold_at: item?.sold_at,
                    },
                    filter: {
                      id: { eq: userCardId },
                    },
                  },
                  onCompleted: ({ updatecardsCollection }) => {
                    if (updatecardsCollection?.records?.length) {
                      refetch?.();
                      setShowLastSoldModal(false);
                    }
                  },
                });
              },
            },
          ],
        );
      },
    [updateCard, userCardId, refetch],
  );

  return (
    <View className={classes.cardInfoWrapper}>
      <View className={classes.priceRow}>
        <Row>
          {isEbay && (
            <Label variant="subtitle" className={classes.priceLastSold}>
              Last sold:
            </Label>
          )}
          <Label variant="subtitle" className={classes.price}>
            {listingType === ListingType.PORTFOLIO ? '' : price}
          </Label>
        </Row>
        <Row className={classes.dateRow}>
          <Icon
            name="calendar"
            variant="SimpleLineIcons"
            size={12}
            color="#a3a3a3"
          />
          <Label className={classes.date}>
            {formatDistanceToNow(new Date(date), { addSuffix: true })}
          </Label>
        </Row>
      </View>
      <Label
        variant="subtitle"
        className={clsx(classes.name, { '-mt-7': !price })}
      >
        {title}
      </Label>
      {!isEbay && (
        <>
          <View className={classes.ebayRow}>
            <Image source={ChaamoLogo} className={classes.chaamoLogo} />
            <Label className={classes.priceValueLabel}>Price Value: </Label>
            <Label className={classes.priceValue}>{marketPrice}</Label>
            {indicator && <PriceIndicator direction={indicator} />}
          </View>
          {!isCorrect && user?.profile?.is_admin && (
            <View className={classes.updateLastSoldContainer}>
              {reason && <Label className={classes.redText}>{reason}</Label>}
              <Button
                variant="danger-light"
                size="small"
                onPress={() => setShowLastSoldModal(true)}
                loading={loading}
                disabled={loading}
              >
                Update last sold manually (admin only)
              </Button>
            </View>
          )}
        </>
      )}
      {!lastSoldIsChecked && user?.id === sellerId && (
        <View className={classes.actionContainer}>
          <Label className={classes.actionLabel}>
            Have a question about the price?
          </Label>
          <Row center className={classes.buttonActionContainer}>
            <Button
              variant="danger-light"
              size="small"
              className={classes.buttonAction}
              onPress={handleClosePriceInfo}
              loading={loading}
              disabled={loading}
            >
              No
            </Button>
            <Button
              variant="primary-light"
              size="small"
              className={classes.buttonAction}
              onPress={handleConfirmIncorrect}
              disabled={loading}
            >
              Contact Us
            </Button>
          </Row>
        </View>
      )}
      {!isEbay && (
        <View className={classes.descriptionWrapper}>
          <Label className={classes.descriptionTitle}>Description</Label>
          <Label className={classes.description}>{description}</Label>
        </View>
      )}
      <Modal
        visible={showLastSoldModal}
        onClose={() => setShowLastSoldModal(false)}
        className={classes.lastSoldModal}
      >
        <View className={classes.lastSoldModalViewContainer}>
          {lastSoldList?.length ? (
            <FlatList
              data={lastSoldList}
              showsVerticalScrollIndicator={false}
              className={classes.lastSoldListContainer}
              contentContainerClassName={classes.lastSoldListWrapper}
              keyExtractor={(item) => item?.node?.id}
              renderItem={({ item }) => (
                <Row className={classes.lastSoldRow}>
                  <TouchableOpacity
                    onPress={() =>
                      setImageZoomUrl(item?.node?.image_hd_url || '')
                    }
                  >
                    <Image
                      source={{ uri: item?.node?.image_url }}
                      className={classes.lastSoldImage}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={handleUpdateLastSoldItem(item?.node)}
                    className={classes.lastSoldContent}
                  >
                    <Label className={classes.lastSoldTitle}>
                      {item?.node?.title}
                    </Label>
                    <Label className={classes.lastSoldPrice}>
                      {formatDisplay(item?.node?.currency, item?.node?.price)}
                    </Label>
                  </TouchableOpacity>
                </Row>
              )}
            />
          ) : (
            <View className={classes.noLastSoldListContainer}>
              <Label className={classes.noLastSoldListText}>
                No last sold list found for this card
              </Label>
            </View>
          )}
        </View>
      </Modal>
      <RNModal visible={!!imageZoomUrl} transparent={true}>
        {imageZoomUrl && (
          <ImageViewer
            imageUrls={[{ url: imageZoomUrl }]}
            onSwipeDown={() => setImageZoomUrl(null)}
            enableImageZoom={true}
            enableSwipeDown={true}
            renderHeader={() => (
              <TouchableOpacity
                onPress={() => setImageZoomUrl(null)}
                className={classes.closeButton}
              >
                <Icon name="close" size={24} color="white" />
              </TouchableOpacity>
            )}
            backgroundColor="rgba(0,0,0,0.9)"
            renderIndicator={(currentIndex, allSize) => (
              <View className={classes.zoomIndicatorContainer}>
                <View className={classes.zoomIndicator}>
                  {Array.from({ length: allSize || 0 }, (_, index) => (
                    <View
                      key={index}
                      className={clsx(
                        classes.zoomDot,
                        index === currentIndex
                          ? classes.zoomActiveDot
                          : classes.zoomInactiveDot,
                      )}
                    />
                  ))}
                </View>
              </View>
            )}
          />
        )}
      </RNModal>
    </View>
  );
};

const classes = {
  cardInfoWrapper: 'px-4.5',
  priceRow: 'flex-row items-center justify-between',
  priceLastSold: 'text-gray-600 text-xl font-bold',
  price: 'text-primary-500 text-xl font-bold',
  dateRow: 'gap-1.5',
  date: 'text-sm text-gray-400',
  name: 'text-lg font-semibold mt-1',
  ebayRow: 'flex-row items-center mt-1 gap-1',
  priceValueLabel: 'text-sm text-gray-500',
  priceValue: 'text-sm text-gray-700 font-bold',
  chaamoLogo: 'w-6 h-6 mr-1 mt-1',
  descriptionWrapper: 'mt-4',
  descriptionTitle: 'text-base font-semibold mb-1',
  description: 'text-base text-gray-700',
  actionContainer: 'gap-5 p-4.5 mt-3 bg-orange-100/60 rounded-xl',
  actionLabel: 'text-base font-normal text-center',
  buttonActionContainer: 'flex-row items-center gap-8',
  buttonAction: 'w-40',
  updateLastSoldContainer: 'gap-2 mt-5',
  redText: 'text-red-600',
  lastSoldModalViewContainer: 'w-full h-full p-4.5',
  lastSoldListContainer: '',
  lastSoldListWrapper: 'gap-3',
  lastSoldRow: 'flex-row !items-start gap-2 bg-slate-100 p-2 rounded-lg',
  lastSoldImage: 'w-16 aspect-[7/10]',
  lastSoldContent: 'flex-1 gap-2',
  lastSoldTitle: 'text-sm font-semibold',
  lastSoldPrice: 'text-sm text-primary-600 font-bold',
  lastSoldModal: 'h-4/6',
  closeButton: 'absolute top-12 right-5 z-10 bg-black/50 rounded-full p-2',
  zoomIndicatorContainer:
    'absolute bottom-12 left-0 right-0 flex items-center justify-center',
  zoomIndicator: 'flex-row bg-black/50 rounded-full px-3 py-2',
  zoomDot: 'w-2 h-2 rounded-full mx-1',
  zoomActiveDot: 'bg-white',
  zoomInactiveDot: 'bg-white/50',
  noLastSoldListContainer: 'flex-1 items-center justify-center',
  noLastSoldListText: 'text-center text-gray-600',
};

export default ProductDetailInfo;
