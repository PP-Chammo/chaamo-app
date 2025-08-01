import React, { memo } from 'react';

import { View } from 'react-native';

import { Icon, Label, Row } from '@/components/atoms';
import { getColor } from '@/utils/getColor';

export interface PlanCardProps {
  name: string;
  price: string;
  benefits: string[];
}

const PlanCard: React.FC<PlanCardProps> = memo(function PlanCard({
  name,
  price,
  benefits,
}) {
  return (
    <View className={classes.container}>
      <Label className={classes.plan}>{name}</Label>
      <Label className={classes.title}>
        CHAAMO
        <Label className={classes.planName}> {name} </Label>
        Membership
      </Label>
      <Label className={classes.description}>
        Enjoy complete access to CHAAMO’s features!
      </Label>
      <Label className={classes.price}>
        ${price}
        <Label className={classes.priceSuffix}>/monthly</Label>
      </Label>
      <Label className={classes.benefits}>Benefits</Label>
      {benefits?.map((benefit) => (
        <Row key={benefit}>
          <Icon name="check" size={24} color={getColor('primary-500')} />
          <Label>{benefit}</Label>
        </Row>
      ))}
    </View>
  );
});

const classes = {
  container: 'bg-white rounded-lg px-6 py-4 border border-amber-500',
  plan: 'text-md bg-yellow-400 py-2 px-6 rounded-lg font-bold self-start mt-7 mb-10 uppercase',
  title: '!text-2xl font-bold text-primary-500 mb-3',
  description: 'text-lg text-gray-500',
  price: '!text-2xl font-bold text-primary-500 my-8',
  benefits: 'mb-5',
  priceSuffix: 'text-sm text-primary-500 font-medium',
  planName: '!text-2xl font-bold text-primary-500 capitalize',
};

export default PlanCard;
