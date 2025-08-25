import React, { memo, useCallback, useMemo, useState } from 'react';

import { clsx } from 'clsx';
import { formatDistanceToNow } from 'date-fns';
import { Image } from 'expo-image';
import { Modal, TouchableOpacity, View } from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';

import ChaamoLogo from '@/assets/images/logo.png';
import { Icon, Label, PriceIndicator, Row, Tag } from '@/components/atoms';
import { ListingType } from '@/generated/graphql';
import { useCurrencyDisplay } from '@/hooks/useCurrencyDisplay';
import { getColor } from '@/utils/getColor';

type ListingItemProps = {
  listingType: ListingType;
  imageUrl: string;
  title: string | React.ReactNode;
  subtitle?: string;
  date: string;
  currency?: string | null;
  price?: string;
  marketCurrency?: string | null;
  marketPrice?: string | null;
  indicator: string;
  rightIcon?: React.ComponentProps<typeof Icon>['name'];
  rightIconSize?: React.ComponentProps<typeof Icon>['size'];
  rightIconColor?: React.ComponentProps<typeof Icon>['color'];
  rightIconVariant?: React.ComponentProps<typeof Icon>['variant'];
  onRightIconPress?: () => void;
  rightComponent?: React.ReactNode;
  featured?: boolean;
  className?: string;
  onPress?: () => void;
  lastSoldIsChecked?: boolean;
  lastSoldIsCorrect?: boolean;
  type?: 'ebay' | 'chaamo';
};

const ListingItem: React.FC<ListingItemProps> = memo(function ListingItem({
  listingType,
  imageUrl,
  title,
  subtitle,
  date,
  currency,
  price,
  marketCurrency,
  marketPrice,
  indicator,
  rightIcon,
  rightIconSize = 20,
  rightIconColor = getColor('slate-600'),
  rightIconVariant,
  rightComponent,
  onRightIconPress,
  className,
  onPress,
  type = 'chaamo',
}) {
  const { formatDisplay } = useCurrencyDisplay();

  const [showImageZoom, setShowImageZoom] = useState(false);

  const priceDisplay = useMemo(
    () => formatDisplay(currency, price ?? 0),
    [currency, formatDisplay, price],
  );

  const renderMarketPrice = useCallback(() => {
    return (
      <>
        <Label className={classes.textBold} testID="card-item-price">
          {formatDisplay(marketCurrency, marketPrice)}
        </Label>
        <PriceIndicator direction={indicator} />
      </>
    );
  }, [formatDisplay, indicator, marketPrice, marketCurrency]);

  const renderRightIcon = useCallback(
    () =>
      onRightIconPress && (
        <TouchableOpacity
          testID="right-icon-button"
          onPress={onRightIconPress}
          className={classes.rightIconButton}
        >
          <Icon
            name={rightIcon}
            variant={rightIconVariant}
            size={rightIconSize}
            color={rightIconColor}
          />
        </TouchableOpacity>
      ),
    [
      onRightIconPress,
      rightIcon,
      rightIconVariant,
      rightIconSize,
      rightIconColor,
    ],
  );

  return (
    <View testID="card-item" className={clsx(classes.container, className)}>
      {imageUrl ? (
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => setShowImageZoom(true)}
        >
          <Image
            testID="card-item-image"
            source={{ uri: imageUrl }}
            className={classes.image}
          />
        </TouchableOpacity>
      ) : (
        <View testID="card-item-image-placeholder" className={classes.image}>
          <Icon name="cards-outline" size={40} color={getColor('red-100')} />
        </View>
      )}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onPress}
        className={classes.contentContainer}
      >
        <Row className={classes.titleContainer}>
          <Label
            className={classes.title}
            testID="card-item-title"
            numberOfLines={3}
          >
            {title}
          </Label>
          {rightComponent ?? renderRightIcon()}
        </Row>
        <View className={classes.dateContainer}>
          {subtitle && (
            <Label
              className={clsx(classes.text, type === 'ebay' ? 'mb-4' : 'mb-2')}
              testID="card-item-subtitle"
            >
              {subtitle}
            </Label>
          )}
          <Row between>
            <Row className={classes.rowDate}>
              <Icon name="calendar" variant="SimpleLineIcons" size={14} />
              <Label className={classes.text} testID="card-item-date">
                {formatDistanceToNow(new Date(date), { addSuffix: true })}
              </Label>
            </Row>
            {type === 'ebay' && (
              <Row right>
                <Label className={classes.textBid}>Sold price:</Label>
                <Label
                  className={classes.textBidPrice}
                  testID="card-item-market-price"
                >
                  {priceDisplay}
                </Label>
              </Row>
            )}
          </Row>
        </View>
        {type === 'chaamo' && (
          <Row between className={classes.priceContainer}>
            <Row>
              <Image source={ChaamoLogo} className={classes.chaamoLogo} />
              <Label className={classes.text}>Price Value:</Label>
              {renderMarketPrice()}
            </Row>
            <Row className={classes.bidContainer}>
              {listingType === ListingType.AUCTION && (
                <View className={classes.tagContainer}>
                  <Tag title="Highest Bid" />
                </View>
              )}
              <Label
                className={classes.textBidPrice}
                testID="card-item-market-price"
              >
                {priceDisplay}
              </Label>
            </Row>
          </Row>
        )}
      </TouchableOpacity>
      {imageUrl && (
        <Modal visible={showImageZoom} transparent={true}>
          <ImageViewer
            imageUrls={[{ url: imageUrl }]}
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
        </Modal>
      )}
    </View>
  );
});

const classes = {
  container: 'flex flex-row gap-3 p-3 bg-white shadow rounded-lg',
  image:
    'w-28 aspect-[7/10] h-auto flex items-center justify-center bg-slate-200 rounded-lg',
  contentContainer: 'flex-1 justify-between gap-0.5 py-1',
  titleContainer: 'gap-2 !items-start',
  title: 'flex-1 text-base font-bold !text-gray-800 truncate pr-10',
  rightIconButton:
    'absolute top-2 right-2 z-10 w-8 h-8 bg-white rounded-full items-center justify-center',
  chaamoLogo: 'w-5 h-5 mr-px',
  dateContainer: 'flex flex-col gap-0.5 pb-1',
  text: 'text-sm !text-gray-700',
  textBold: 'text-sm font-semibold',
  rowDate: 'gap-2',
  bidContainer: 'flex items-center justify-end gap-1.5',
  textBid: 'text-base !text-gray-700',
  textBidPrice: 'text-base text-right font-semibold text-primary-500 pr-1',
  priceContainer: '!items-end',
  logoImage: 'w-6 h-6',
  tagContainer: 'absolute bottom-7 right-0',
  textProcessing: 'text-sm !text-primary-500/70 font-normal',
  closeButton: 'absolute top-10 right-5 z-10 bg-black/50 rounded-full p-2',
};

export default ListingItem;
