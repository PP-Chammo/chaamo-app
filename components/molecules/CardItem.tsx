import { memo, useCallback } from 'react';

import { clsx } from 'clsx';
import { formatDistanceToNow } from 'date-fns';
import { Image, TouchableOpacity, View } from 'react-native';

import EBayLogo from '@/assets/svg/ebay.svg';
import { Icon, Label, Row } from '@/components/atoms';
import { getColor } from '@/utils/getColor';

type CardItemProps = {
  imageUrl: string;
  title: string;
  subtitle?: string;
  price: string;
  date: string;
  marketPrice: string;
  marketType: string;
  indicator: string;
  rightIcon?: React.ComponentProps<typeof Icon>['name'];
  rightIconSize?: React.ComponentProps<typeof Icon>['size'];
  rightIconColor?: React.ComponentProps<typeof Icon>['color'];
  rightIconVariant?: React.ComponentProps<typeof Icon>['variant'];
  onRightIconPress?: () => void;
  rightComponent?: React.ReactNode;
  featured?: boolean;
  className?: string;
};

const CardItem: React.FC<CardItemProps> = memo(function CardItem({
  imageUrl,
  title,
  subtitle,
  price,
  date,
  marketPrice,
  marketType,
  indicator,
  rightIcon,
  rightIconSize,
  rightIconColor = getColor('slate-600'),
  rightIconVariant,
  rightComponent,
  onRightIconPress,
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
        <View className={classes.topContainer}>
          <Row className={classes.titleContainer}>
            <Label className={classes.title} testID="card-item-title">
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
        </View>
        <Row between className={classes.priceContainer}>
          <View>
            {marketType === 'eBay' && <EBayLogo />}
            <Row>
              <Label className={classes.text}>Price Value:</Label>
              <Label className={classes.textBold} testID="card-item-price">
                {price}
              </Label>
              <Icon
                name={indicator === 'up' ? 'trending-up' : 'trending-down'}
                color={getColor(indicator === 'up' ? 'teal-600' : 'red-600')}
                size={16}
              />
            </Row>
          </View>
          <View className={classes.bidContainer}>
            <Label
              className={classes.textBidPrice}
              testID="card-item-market-price"
            >
              {marketPrice}
            </Label>
          </View>
        </Row>
      </View>
    </TouchableOpacity>
  );
});

const classes = {
  container: 'flex flex-row gap-3 mx-4.5 p-3 bg-white shadow rounded-lg',
  image:
    'w-28 min-h-40 h-auto flex items-center justify-center bg-gray-200 rounded-lg',
  contentContainer: 'flex-1 justify-between',
  topContainer: 'gap-2',
  titleContainer: 'py-1',
  title: 'text-base font-bold !text-gray-800 truncate',
  rightIconButton:
    'absolute top-0 right-0 z-10 w-8 h-8 bg-white rounded-full items-center justify-center',
  dateContainer: 'py-1',
  text: 'text-sm !text-gray-700',
  textBold: 'text-sm font-semibold',
  rowDate: 'gap-2',
  bidContainer: 'flex flex-col items-end justify-end',
  textBidPrice: 'text-base font-semibold text-teal-600',
  priceContainer: '!items-end',
};

export default CardItem;
