import { memo } from 'react';

import { Image, TouchableOpacity, View } from 'react-native';

import EBayLogo from '@/assets/svg/ebay.svg';
import { FavoriteButton, Icon, Label, Row, Tag } from '@/components/atoms';
import { getColor } from '@/utils/getColor';

type CardInfoProps = {
  imageUrl: string;
  title: string;
  bidPrice: string;
  currentPrice: string;
  indicator: string;
  onFavoritePress: () => void;
  featured?: boolean;
};

const CardInfo: React.FC<CardInfoProps> = memo(function CategoryItem({
  imageUrl,
  title,
  currentPrice,
  bidPrice,
  indicator,
  onFavoritePress,
  featured = false,
}) {
  return (
    <TouchableOpacity activeOpacity={0.8} className={classes.container}>
      {imageUrl ? (
        <Image source={{ uri: imageUrl }} className={classes.image} />
      ) : (
        <View className={classes.image}>
          <Icon name="cards-outline" size={40} color={getColor('red-100')} />
        </View>
      )}
      <View className={classes.contentContainer}>
        <Row className={classes.titleContainer}>
          <Label className={classes.title}>{title}</Label>
          <FavoriteButton
            onPress={onFavoritePress}
            iconSize={24}
            className={classes.favoriteButton}
          />
        </Row>
        <View className={classes.dateContainer}>
          <Label className={classes.text}>2023 Elly De La Cruz</Label>
          <Row className={classes.rowDate}>
            <Icon name="calendar" variant="SimpleLineIcons" size={14} />
            <Label className={classes.text}>2 days ago</Label>
          </Row>
        </View>
        <Row between>
          <View>
            <EBayLogo />
            <Row>
              <Label className={classes.text}>Price Value:</Label>
              <Label className={classes.textBold}>{currentPrice}</Label>
              <Icon
                name={indicator === 'up' ? 'trending-up' : 'trending-down'}
                color={getColor(indicator === 'up' ? 'teal-600' : 'red-600')}
                size={16}
              />
            </Row>
          </View>
          <View className={classes.bidContainer}>
            <Tag title="Highest Bid" textClassName={classes.tag} />
            <Label className={classes.textBidPrice}>{bidPrice}</Label>
          </View>
        </Row>
      </View>
    </TouchableOpacity>
  );
});

const classes = {
  container: 'flex flex-row gap-3 mx-5 p-3 bg-white shadow rounded-lg',
  image:
    'w-28 min-h-40 h-auto flex items-center justify-center bg-gray-200 rounded-lg',
  contentContainer: 'flex-1 justify-between',
  titleContainer: 'py-2',
  title: 'text-base font-bold !text-gray-800 truncate',
  favoriteButton: 'right-0',
  dateContainer: 'py-1',
  text: 'text-sm !text-gray-700',
  textBold: 'text-sm font-semibold',
  rowDate: 'gap-2',
  currentPrice: 'text-sm text-teal-500 !font-bold',
  tag: '!text-xs',
  bidContainer: 'flex flex-col items-end',
  textBidPrice: 'text-base font-semibold text-teal-600',
};

export default CardInfo;
