import { memo } from 'react';

import { clsx } from 'clsx';
import { Image, View } from 'react-native';

import EBayImage from '@/assets/svg/ebay.svg';
import { Badge, Icon, Label } from '@/components/atoms';
import { getColor } from '@/utils/getColor';

type CardProps = {
  imageUrl: string;
  title: string;
  bidPrice: string;
  currentPrice?: string;
  indicator: string;
  featured?: boolean;
  rightComponent?: React.ReactNode;
  mode?: 'normal' | 'full' | 'half';
};

const Card: React.FC<CardProps> = memo(function CategoryItem({
  imageUrl,
  title,
  currentPrice,
  bidPrice,
  indicator,
  featured = false,
  rightComponent,
  mode = 'normal',
}) {
  return (
    <View className={clsx(classes.container[mode])}>
      {featured && <Badge />}
      {rightComponent}
      {imageUrl ? (
        <Image
          source={{ uri: imageUrl }}
          className={clsx(classes.image[mode])}
        />
      ) : (
        <View className={clsx(classes.image[mode])}>
          <Icon name="cards-outline" size={40} color={getColor('red-100')} />
        </View>
      )}
      {currentPrice && (
        <Label variant="subtitle" className={classes.currentPrice}>
          {currentPrice}
        </Label>
      )}
      <Label variant="subtitle" className={classes.title}>
        {title}
      </Label>
      <View className={classes.marketContainer}>
        <EBayImage />
        <Label className={classes.bidPrice}>{bidPrice}</Label>
        <Icon
          name={indicator === 'up' ? 'trending-up' : 'trending-down'}
          color={getColor(indicator === 'up' ? 'teal-600' : 'red-600')}
          size={16}
        />
      </View>
    </View>
  );
});

const classes = {
  container: {
    normal: 'flex flex-col gap-2',
    full: 'flex-1 flex flex-col gap-2',
    half: 'w-1/2 flex flex-col gap-2',
  },
  image: {
    normal: 'w-36 min-h-[170px] h-auto  bg-gray-200 rounded-lg',
    full: 'w-full min-h-[170px] h-auto  bg-gray-200 rounded-lg',
    half: 'w-full min-h-[170px] h-auto  bg-gray-200 rounded-lg',
  },
  currentPrice: 'text-sm text-teal-500 !font-bold',
  bidPrice: 'text-xs text-gray-500',
  title: 'text-sm !text-gray-800',
  marketContainer: 'flex flex-row items-center gap-1.5',
  rightIcon: 'absolute top-2 right-2 z-10',
};

export default Card;
