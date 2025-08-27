import React, { memo, useMemo } from 'react';

import { clsx } from 'clsx';
import { upperFirst } from 'lodash';
import pluralize from 'pluralize';
import { View } from 'react-native';

import { Icon, Label, Row } from '@/components/atoms';
import { MembershipType } from '@/generated/graphql';
import { getColor } from '@/utils/getColor';

export interface PlanCardProps {
  type: MembershipType;
  name: string;
  description: string;
  subscriptionDays: number;
  priceDisplay: string;
  benefits: string[];
}

const PlanCard: React.FC<PlanCardProps> = memo(function PlanCard({
  type,
  name,
  description,
  subscriptionDays,
  priceDisplay,
  benefits,
}) {
  const parsedSubscriptionDays = useMemo(() => {
    if (subscriptionDays === 30) {
      return 'monthly';
    }

    if (subscriptionDays === 365) {
      return 'yearly';
    }

    return `${pluralize('day', subscriptionDays, true)}`;
  }, [subscriptionDays]);

  return (
    <View className={classes.container}>
      <Label
        className={clsx(
          classes.plan,
          classes.planType?.[type as keyof typeof classes.planType],
        )}
      >
        {upperFirst(type)}
      </Label>
      <Label className={classes.title}>{name}</Label>
      <Label className={classes.description}>{description}</Label>
      <Label className={classes.price}>
        {priceDisplay}
        <Label className={classes.priceSuffix}>/{parsedSubscriptionDays}</Label>
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
  plan: 'text-md py-2 px-6 rounded-lg font-bold self-start mt-7 mb-10 uppercase',
  planType: {
    gold: 'bg-yellow-400',
    silver: 'bg-silver-400',
    bronze: 'bg-bronze-400',
  },
  title: '!text-2xl font-bold text-primary-500 mb-3',
  description: 'text-lg text-gray-500',
  price: '!text-2xl font-bold text-primary-500 my-8',
  benefits: 'mb-5',
  priceSuffix: 'text-sm text-primary-500 font-medium',
  planName: '!text-2xl font-bold text-primary-500 capitalize',
};

export default PlanCard;
