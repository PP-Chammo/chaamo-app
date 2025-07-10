import React, { memo } from 'react';

import { formatDistance } from 'date-fns';
import { Image, View } from 'react-native';

import EBayImage from '@/assets/svg/ebay.svg';
import { Icon, Label, Row } from '@/components/atoms';
import { getColor } from '@/utils/getColor';

interface WishListItemProps {
  imageUrl: string;
  title: string;
  creator: string;
  year: string;
  currentPrice: string;
  bidPrice: string;
  date: string;
}

const WishListItem: React.FC<WishListItemProps> = memo(function WishListItem({
  imageUrl,
  title,
  creator,
  year,
  currentPrice,
  bidPrice,
  date,
}) {
  return (
    <Row className={classes.container}>
      <View className={classes.imageContainer}>
        <Image
          source={{ uri: imageUrl }}
          className={classes.image}
          resizeMode="cover"
        />
      </View>
      <View className={classes.contentContainer}>
        <Row between>
          <Label className={classes.titleText}>{title}</Label>
          <Icon name="heart" color={getColor('red-600')} size={16} />
        </Row>
        <Row className={classes.creatorContainer}>
          <Label className={classes.yearText}>{year}</Label>
          <Label className={classes.creatorText}>{creator}</Label>
        </Row>
        <Row className={classes.dateContainer}>
          <Icon
            name="calendar-month-outline"
            color={getColor('slate-500')}
            size={14}
          />
          <Label className={classes.dateText}>
            {formatDistance(new Date(date), new Date(), { addSuffix: true })}
          </Label>
        </Row>

        <Row between className={classes.priceContainer}>
          <View>
            <EBayImage />
            <Row>
              <Label className={classes.priceLabel}>Price Value: </Label>
              <Label className={classes.priceValue}>{currentPrice}</Label>
              <Icon name="trending-up" color={getColor('teal-600')} size={16} />
            </Row>
          </View>
          <View className={classes.bidContainer}>
            <Label className={classes.bidLabel}>Highest Bid</Label>
            <Label className={classes.bidPrice}>{bidPrice}</Label>
          </View>
        </Row>
      </View>
    </Row>
  );
});

const classes = {
  container: 'bg-white rounded-lg p-3.5 gap-3.5',
  imageContainer: 'w-1/4',
  image: 'w-full h-32 rounded-lg',
  contentContainer: 'flex-1',
  creatorContainer: 'gap-1',
  dateContainer: 'gap-1',
  priceContainer: 'mt-5',
  bidContainer: 'items-end',
  bidLabel: 'text-xs bg-teal-50 !text-teal-600 p-2',
  bidPrice: '!text-teal-600 font-bold text-sm',
  priceLabel: 'text-xs',
  priceValue: '!text-slate-800 font-bold text-xs',
  dateText: '!text-slate-500 text-xs',
  yearText: '!text-slate-500 text-xs',
  creatorText: '!text-slate-500 text-xs',
  titleText: '!text-slate-800 !text-sm font-bold',
};

export default WishListItem;
