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
    <Row className="bg-white rounded-lg p-3.5 gap-3.5">
      <View className="w-1/4">
        <Image
          source={{ uri: imageUrl }}
          className="w-full h-32 rounded-lg"
          resizeMode="cover"
        />
      </View>
      <View className="flex-1">
        <Row between>
          <Label className="!text-slate-800 !text-sm font-bold">{title}</Label>
          <Icon name="heart" color={getColor('red-600')} size={16} />
        </Row>
        <Row className="gap-1">
          <Label className="!text-slate-500 text-xs">{year}</Label>
          <Label className="!text-slate-500 text-xs">{creator}</Label>
        </Row>
        <Row>
          <Icon
            name="calendar-month-outline"
            color={getColor('slate-500')}
            size={14}
          />
          <Label className="!text-slate-500 text-xs">
            {formatDistance(new Date(date), new Date(), { addSuffix: true })}
          </Label>
        </Row>

        <Row between className="mt-5">
          <View>
            <EBayImage />
            <Row>
              <Label className="text-xs">Price Value: </Label>
              <Label className="!text-slate-800 font-bold text-xs">
                {currentPrice}
              </Label>
              <Icon name="trending-up" color={getColor('teal-600')} size={16} />
            </Row>
          </View>
          <View className="items-end">
            <Label className="text-xs bg-teal-50 !text-teal-600 p-2">
              Highest Bid
            </Label>
            <Label className="!text-teal-600 font-bold text-sm">
              {bidPrice}
            </Label>
          </View>
        </Row>
      </View>
    </Row>
  );
});

export default WishListItem;
