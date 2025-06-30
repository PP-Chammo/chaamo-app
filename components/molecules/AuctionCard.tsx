import { memo } from 'react';

import { Image, View } from 'react-native';

import { Badge, FavoriteButton, Icon, Label, Tag } from '@/components/atoms';
import { getColor } from '@/utils/getColor';

type AuctionCardProps = {
  imageUrl: string;
  title: string;
  price: string;
  onFavoritePress: () => void;
  featured?: boolean;
};

const AuctionCard: React.FC<AuctionCardProps> = memo(function CategoryItem({
  imageUrl,
  title,
  price,
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
      <Label variant="subtitle" className={classes.title}>
        {title}
      </Label>
      <Tag title="Highest Bid" />
      <Label variant="subtitle" className={classes.price}>
        {price}
      </Label>
    </View>
  );
});

const classes = {
  container: 'flex flex-col gap-2',
  image:
    'w-36 min-h-[170px] h-auto flex items-center justify-center bg-gray-200 rounded-lg',
  title: 'text-sm !text-gray-800',
  price: 'text-sm !text-gray-800',
  marketContainer: 'flex flex-row items-center gap-1.5',
  indicator: 'text-xs text-gray-500',
};

export default AuctionCard;
