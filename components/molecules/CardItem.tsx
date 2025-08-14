import { memo, useCallback, useMemo } from 'react';

import { clsx } from 'clsx';
import { formatDistanceToNow } from 'date-fns';
import { Image } from 'expo-image';
import { TouchableOpacity, View } from 'react-native';

import EBayLogo from '@/assets/svg/ebay.svg';
import { Icon, Label, PriceIndicator, Row, Tag } from '@/components/atoms';
import { ListingType } from '@/generated/graphql';
import { useCurrencyDisplay } from '@/hooks/useCurrencyDisplay';
import { getColor } from '@/utils/getColor';

type CardItemProps = {
  listingType: ListingType;
  imageUrl: string;
  title: string;
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
};

const CardItem: React.FC<CardItemProps> = memo(function CardItem({
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
}) {
  const { formatDisplay } = useCurrencyDisplay();

  const priceDisplay = useMemo(
    () => formatDisplay(currency, price ?? 0),
    [currency, formatDisplay, price],
  );

  const renderMarketPrice = useCallback(() => {
    if (marketPrice === null) {
      return (
        <>
          <Label className={classes.textProcessing} testID="card-item-price">
            process last sold...
          </Label>
        </>
      );
    }
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
    <TouchableOpacity
      testID="card-item"
      activeOpacity={0.8}
      onPress={onPress}
      className={clsx(classes.container, className)}
    >
      {imageUrl ? (
        <Image
          testID="card-item-image"
          source={{ uri: imageUrl }}
          className={classes.image}
        />
      ) : (
        <View testID="card-item-image-placeholder" className={classes.image}>
          <Icon name="cards-outline" size={40} color={getColor('red-100')} />
        </View>
      )}
      <View className={classes.contentContainer}>
        <Row className={classes.titleContainer}>
          <Label
            className={classes.title}
            testID="card-item-title"
            numberOfLines={2}
          >
            {title}
          </Label>
          {rightComponent ?? renderRightIcon()}
        </Row>

        <View className={classes.dateContainer}>
          {subtitle && (
            <Label className={classes.text} testID="card-item-subtitle">
              {subtitle}
            </Label>
          )}
          <Row className={classes.rowDate}>
            <Icon name="calendar" variant="SimpleLineIcons" size={14} />
            <Label className={classes.text} testID="card-item-date">
              {formatDistanceToNow(new Date(date), { addSuffix: true })}
            </Label>
          </Row>
        </View>

        <Row between className={classes.priceContainer}>
          <View>
            <EBayLogo />
            <Row>
              <Label className={classes.text}>Price Value:</Label>
              {renderMarketPrice()}
            </Row>
          </View>
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
            {listingType === ListingType.SELL && (
              <Image
                source={require('@/assets/images/logo.png')}
                className={classes.logoImage}
              />
            )}
          </Row>
        </Row>
      </View>
    </TouchableOpacity>
  );
});

const classes = {
  container: 'flex flex-row gap-3 p-3 bg-white shadow rounded-lg',
  image:
    'w-28 aspect-[7/10] h-auto flex items-center justify-center bg-slate-200 rounded-lg',
  contentContainer: 'flex-1 justify-between gap-0.5 py-1',
  titleContainer: 'gap-2 !items-start',
  title: 'flex-1 text-base font-bold !text-gray-800 truncate',
  rightIconButton:
    'z-10 w-8 h-8 bg-white rounded-full items-center justify-center',
  dateContainer: 'flex flex-col gap-0.5 pb-1',
  text: 'text-sm !text-gray-700',
  textBold: 'text-sm font-semibold',
  rowDate: 'gap-2',
  bidContainer: 'flex items-center justify-end gap-1.5',
  textBidPrice: 'text-base text-right font-semibold text-primary-500 pr-1',
  priceContainer: '!items-end',
  logoImage: 'w-6 h-6',
  tagContainer: 'absolute bottom-7 right-0',
  textProcessing: 'text-sm !text-primary-500/70 font-normal',
};

export default CardItem;
