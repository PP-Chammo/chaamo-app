import { memo, useCallback } from 'react';

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { clsx } from 'clsx';
import { Image } from 'expo-image';
import { TouchableOpacity, View } from 'react-native';

import EBayImage from '@/assets/svg/ebay.svg';
import { Icon, Label, PriceIndicator, Tag } from '@/components/atoms';
import { ListingType } from '@/generated/graphql';
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
  price,
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
              {price}
            </Label>
          </View>
        </View>
      ) : (
        <View className={classes.contentContainer}>
          <View className={classes.titleContainer}>
            {!!price && type === ListingType.SELL && (
              <Label
                variant="subtitle"
                className={classes.price}
                testID="listing-card-price"
              >
                {price}
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
            <Label
              className={clsx(classes.marketPrice, {
                '!font-bold !text-xs': !price,
              })}
              testID="listing-card-market-price"
            >
              {marketPrice}
            </Label>
            {indicator && <PriceIndicator direction={indicator} />}
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
};
