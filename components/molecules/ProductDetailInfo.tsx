import React from 'react';

import { formatDistanceToNow } from 'date-fns';
import { View } from 'react-native';

import EBayImage from '@/assets/svg/ebay.svg';
import { Icon, Label, Row } from '@/components/atoms';

interface ProductDetailInfoProps {
  price: string | number;
  date: string | Date;
  title: string;
  marketPrice: string | number;
  description: string;
}

const ProductDetailInfo: React.FC<ProductDetailInfoProps> = ({
  price,
  date,
  title,
  marketPrice,
  description,
}) => {
  return (
    <View className={classes.cardInfoWrapper}>
      <View className={classes.priceRow}>
        <Label variant="subtitle" className={classes.price}>
          {price}
        </Label>
        <Row className={classes.dateRow}>
          <Icon
            name="calendar"
            variant="SimpleLineIcons"
            size={12}
            color="#a3a3a3"
          />
          <Label className={classes.date}>
            {formatDistanceToNow(new Date(date), { addSuffix: true })}
          </Label>
        </Row>
      </View>
      <Label variant="subtitle" className={classes.name}>
        {title}
      </Label>
      <View className={classes.ebayRow}>
        <EBayImage />
        <Label className={classes.priceValueLabel}>Price Value: </Label>
        <Label className={classes.priceValue}>{marketPrice}</Label>
      </View>
      <View className={classes.descriptionWrapper}>
        <Label className={classes.descriptionTitle}>Description</Label>
        <Label className={classes.description}>{description}</Label>
      </View>
    </View>
  );
};

const classes = {
  cardInfoWrapper: 'px-4.5',
  priceRow: 'flex-row items-center justify-between',
  price: 'text-teal-600 text-xl font-bold',
  dateRow: 'gap-1.5',
  date: 'text-sm text-gray-400',
  name: 'text-lg font-semibold mt-1',
  ebayRow: 'flex-row items-center mt-1 gap-1',
  priceValueLabel: 'text-sm text-gray-500',
  priceValue: 'text-sm text-gray-700 font-bold',
  descriptionWrapper: 'mt-4',
  descriptionTitle: 'text-base font-semibold mb-1',
  description: 'text-base text-gray-700',
};

export default ProductDetailInfo;
