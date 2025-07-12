import { memo } from 'react';

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image, TouchableOpacity, View } from 'react-native';

import { Icon, Label, Tag } from '@/components/atoms';
import { AuctionCardType } from '@/types/card';
import { getColor } from '@/utils/getColor';

interface AuctionCardProps extends AuctionCardType {
  onPress?: () => void;
  onRightIconPress?: () => void;
  rightIcon?: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  rightIconSize?: React.ComponentProps<typeof MaterialCommunityIcons>['size'];
  rightIconColor?: React.ComponentProps<typeof MaterialCommunityIcons>['color'];
}

const AuctionCard: React.FC<AuctionCardProps> = memo(function CategoryItem({
  imageUrl,
  title,
  price,
  onPress,
  onRightIconPress,
  rightIcon,
  rightIconSize,
  rightIconColor,
}) {
  return (
    <TouchableOpacity
      testID="auction-card"
      activeOpacity={0.8}
      onPress={onPress}
      className={classes.container}
    >
      {onRightIconPress && (
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
      )}
      {imageUrl ? (
        <Image
          testID="auction-image"
          source={{ uri: imageUrl }}
          className={classes.image}
        />
      ) : (
        <View testID="auction-image-placeholder" className={classes.image}>
          <Icon name="cards-outline" size={40} color={getColor('red-100')} />
        </View>
      )}
      <Label
        variant="subtitle"
        className={classes.title}
        testID="auction-title"
      >
        {title}
      </Label>
      <Tag title="Highest Bid" />
      <Label
        variant="subtitle"
        className={classes.price}
        testID="auction-price"
      >
        {price}
      </Label>
    </TouchableOpacity>
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
  rightIconButton:
    'absolute top-2 right-2 z-10 w-8 h-8 bg-white rounded-full items-center justify-center',
};

export default AuctionCard;
