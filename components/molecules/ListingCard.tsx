import { memo, useCallback, useMemo } from 'react';

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { clsx } from 'clsx';
import { Image } from 'expo-image';
import { TouchableOpacity, View } from 'react-native';

import EBayImage from '@/assets/svg/ebay.svg';
import { Icon, Label, PriceIndicator, Tag } from '@/components/atoms';
import { ListingType } from '@/generated/graphql';
import { useCurrencyDisplay } from '@/hooks/useCurrencyDisplay';
import { ListingCardType } from '@/types/card';
import { getColor } from '@/utils/getColor';

interface ListingCardProps extends ListingCardType {
  onPress?: () => void;
  onRightIconPress?: () => void;
  rightIcon?: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  rightIconSize?: React.ComponentProps<typeof MaterialCommunityIcons>['size'];
  rightIconColor?: React.ComponentProps<typeof MaterialCommunityIcons>['color'];
  rightComponent?: React.ReactNode;
  className?: string;
}

const ListingCard: React.FC<ListingCardProps> = memo(function CategoryItem({
  type = ListingType.SELL,
  imageUrl,
  title,
  currency,
  price,
  marketCurrency,
  marketPrice,
  indicator,
  onPress,
  onRightIconPress,
  rightIcon,
  rightIconSize = 18,
  rightIconColor = getColor('slate-700'),
  rightComponent,
  className,
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
        <Label
          className={clsx(classes.marketPrice, {
            '!font-bold !text-xs': !price,
          })}
          testID="listing-card-market-price"
        >
          {formatDisplay(marketCurrency, marketPrice)}
        </Label>
        {indicator && <PriceIndicator direction={indicator} />}
      </>
    );
  }, [formatDisplay, indicator, marketCurrency, marketPrice, price]);

  const renderRightIcon = useCallback(
    () =>
      onRightIconPress && (
        <TouchableOpacity
          testID="right-icon-button"
          onPress={onRightIconPress}
          className={classes.rightIconButton}
        >
          <MaterialCommunityIcons
            name={rightIcon}
            size={rightIconSize}
            color={rightIconColor}
          />
        </TouchableOpacity>
      ),
    [rightIcon, rightIconSize, rightIconColor, onRightIconPress],
  );

  return (
    <TouchableOpacity
      testID="listing-card"
      activeOpacity={0.8}
      className={clsx(classes.container, className)}
      onPress={onPress}
    >
      {rightComponent ?? renderRightIcon()}
      {imageUrl ? (
        <Image
          testID="listing-card-image"
          source={{ uri: imageUrl }}
          className={clsx(classes.image)}
        />
      ) : (
        <View
          testID="listing-card-image-placeholder"
          className={clsx(classes.image)}
        >
          <Icon name="cards-outline" size={40} color={getColor('red-100')} />
        </View>
      )}
      {type === ListingType.AUCTION ? (
        <View className={classes.contentContainer}>
          <View className={classes.titleContainer}>
            <Label
              variant="subtitle"
              className={classes.title}
              testID="auction-title"
            >
              {title}
            </Label>
          </View>
          <View className={classes.bidContainer}>
            <Tag title="Highest Bid" />
            <Label
              variant="subtitle"
              className={classes.price}
              testID="auction-price"
            >
              {priceDisplay}
            </Label>
          </View>
        </View>
      ) : (
        <View className={classes.contentContainer}>
          <View className={classes.titleContainer}>
            {type !== ListingType.PORTFOLIO && (
              <Label
                variant="subtitle"
                className={classes.price}
                testID="listing-card-price"
              >
                {priceDisplay}
              </Label>
            )}
            <Label
              variant="subtitle"
              className={classes.title}
              testID="listing-card-title"
            >
              {title}
            </Label>
          </View>
          <View className={classes.marketContainer}>
            <EBayImage />
            {renderMarketPrice()}
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
});

export default ListingCard;

const classes = {
  container: 'w-36 flex flex-col gap-2 justify-between',
  contentContainer: 'flex-1 justify-between gap-2',
  image: 'w-36 aspect-[7/10] bg-gray-200 rounded',
  titleContainer: 'flex-1 flex flex-col gap-1',
  price: 'text-sm text-primary-500 !font-bold',
  marketPrice: 'text-xs text-gray-500',
  title: 'text-sm !text-gray-800',
  marketContainer: 'flex flex-row items-center gap-2',
  rightIconButton:
    'absolute top-2 right-2 z-10 w-8 h-8 bg-white rounded-full items-center justify-center',
  bidContainer: 'flex gap-2',
  textProcessing: 'text-xs !text-gray-500/70 font-normal',
};
