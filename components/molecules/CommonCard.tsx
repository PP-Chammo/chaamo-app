import { memo, useCallback, useMemo } from 'react';

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { clsx } from 'clsx';
import { Image, TouchableOpacity, View } from 'react-native';

import EBayImage from '@/assets/svg/ebay.svg';
import { Badge, Icon, Label } from '@/components/atoms';
import { PriceIndicator } from '@/components/molecules';
import { CommonCardType } from '@/types/card';
import { getColor } from '@/utils/getColor';

interface CommonCardProps extends Omit<CommonCardType, 'price'> {
  featured?: boolean;
  price?: string;
  onPress?: () => void;
  onRightIconPress?: () => void;
  rightIcon?: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  rightIconSize?: React.ComponentProps<typeof MaterialCommunityIcons>['size'];
  rightIconColor?: React.ComponentProps<typeof MaterialCommunityIcons>['color'];
  rightComponent?: React.ReactNode;
  className?: string;
}

const CommonCard: React.FC<CommonCardProps> = memo(function CategoryItem({
  imageUrl,
  title,
  price,
  marketPrice,
  marketType,
  indicator,
  featured = false,
  onPress,
  onRightIconPress,
  rightIcon,
  rightIconSize = 18,
  rightIconColor = getColor('slate-700'),
  rightComponent,
  className,
}) {
  const renderMarketType = useMemo(() => {
    if (marketType === 'eBay') {
      return <EBayImage />;
    }
    return <></>;
  }, [marketType]);

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
      testID="common-card"
      activeOpacity={0.8}
      className={clsx(classes.container, className)}
      onPress={onPress}
    >
      {featured && <Badge />}
      {rightComponent ?? renderRightIcon()}
      {imageUrl ? (
        <Image
          testID="common-card-image"
          source={{ uri: imageUrl }}
          className={clsx(classes.image)}
        />
      ) : (
        <View
          testID="common-card-image-placeholder"
          className={clsx(classes.image)}
        >
          <Icon name="cards-outline" size={40} color={getColor('red-100')} />
        </View>
      )}
      {!!price && (
        <Label
          variant="subtitle"
          className={classes.price}
          testID="common-card-price"
        >
          {price}
        </Label>
      )}
      <Label
        variant="subtitle"
        className={classes.title}
        testID="common-card-title"
      >
        {title}
      </Label>
      <View className={classes.marketContainer}>
        {renderMarketType}
        <Label
          className={clsx(classes.marketPrice, {
            '!font-bold !text-xs': !price,
          })}
          testID="common-card-market-price"
        >
          {marketPrice}
        </Label>
        <PriceIndicator direction={indicator} />
      </View>
    </TouchableOpacity>
  );
});

export default CommonCard;

const classes = {
  container: 'w-36 flex flex-col gap-2',
  image: 'w-full h-[170px] h-auto  bg-gray-200 rounded-lg',
  price: 'text-sm text-primary-500 !font-bold',
  marketPrice: 'text-xs text-gray-500',
  title: 'text-sm !text-gray-800',
  marketContainer: 'flex flex-row items-center gap-1.5',
  rightIconButton:
    'absolute top-2 right-2 z-10 w-8 h-8 bg-white rounded-full items-center justify-center',
};
