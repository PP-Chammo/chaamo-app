import { memo } from 'react';

import { clsx } from 'clsx';
import { Image, View } from 'react-native';

import { Badge, FavoriteButton, Icon, Label } from '@/components/atoms';
import { getColor } from '@/utils/getColor';

type CardProps = {
  imageUrl: string;
  title: string;
  bidPrice: string;
  currentPrice: string;
  indicator: string;
  onFavoritePress: () => void;
  featured?: boolean;
};

const Card: React.FC<CardProps> = memo(function CategoryItem({
  imageUrl,
  title,
  currentPrice,
  bidPrice,
  indicator,
  onFavoritePress,
  featured = false,
}) {
  return (
    <View className={classes.container}>
      {featured && <Badge />}
      <FavoriteButton onPress={onFavoritePress} />
      {imageUrl ? (
        <Image source={{ uri: imageUrl }} className={classes.image} />
      ) : (
        <View className={classes.image}>
          <Icon name="cards-outline" size={40} color={getColor('red-100')} />
        </View>
      )}
      <Label variant="subtitle" className={classes.currentPrice}>
        {currentPrice}
      </Label>
      <Label variant="subtitle" className={classes.title}>
        {title}
      </Label>
      <View className={classes.marketContainer}>
        <Label className={classes.bidPrice}>{bidPrice}</Label>
        <Label
          variant="subtitle"
          className={clsx(classes.indicator, {
            'text-red-500': indicator === 'down',
            'text-teal-500': indicator === 'up',
          })}
        >
          {indicator}
        </Label>
      </View>
    </View>
  );
});

const classes = {
  container: 'flex flex-col gap-2',
  image:
    'w-36 min-h-[170px] h-auto flex items-center justify-center bg-gray-200 rounded-lg',
  currentPrice: 'text-sm text-teal-500 !font-bold',
  bidPrice: 'text-xs text-gray-500',
  title: 'text-sm !text-gray-800',
  marketContainer: 'flex flex-row items-center gap-1.5',
  indicator: 'text-xs text-gray-500',
};

export default Card;
