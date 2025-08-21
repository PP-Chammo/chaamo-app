import React, { useCallback, useMemo } from 'react';

import { clsx } from 'clsx';
import { formatDistanceToNow } from 'date-fns';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { View } from 'react-native';

import ChaamoLogo from '@/assets/images/logo.png';
import { Button, Icon, Label, PriceIndicator, Row } from '@/components/atoms';
import { useUpdateUserCardMutation } from '@/generated/graphql';
import { useUserVar } from '@/hooks/useUserVar';

interface ProductDetailInfoProps {
  price?: string | number;
  date: string | Date;
  title: string;
  marketPrice: string | number;
  description: string;
  indicator?: 'up' | 'down';
  listingId?: string;
  userCardId?: string;
  sellerId?: string;
  lastSoldIsChecked?: boolean;
  lastSoldIsCorrect?: boolean;
  detailRefetch?: () => void;
}

const ProductDetailInfo: React.FC<ProductDetailInfoProps> = ({
  price,
  date,
  title,
  listingId,
  userCardId,
  sellerId,
  marketPrice,
  description,
  indicator,
  lastSoldIsChecked,
  lastSoldIsCorrect,
  detailRefetch,
}) => {
  const [user] = useUserVar();

  const [updateCheckedLastSold, { loading }] = useUpdateUserCardMutation();

  const marketPriceDisplay = useMemo(() => {
    if (user?.id === sellerId && !String(marketPrice).includes('calculating')) {
      return lastSoldIsChecked
        ? marketPrice
        : `${marketPrice} - (need confirm)`;
    }
    return lastSoldIsChecked && lastSoldIsCorrect
      ? marketPrice
      : 'calculating...';
  }, [marketPrice, user?.id, sellerId, lastSoldIsChecked, lastSoldIsCorrect]);

  const isCalculating = useMemo(() => {
    return String(marketPriceDisplay).includes('calculating');
  }, [marketPriceDisplay]);

  const handleConfirmCorrect = useCallback(() => {
    updateCheckedLastSold({
      variables: {
        filter: {
          id: { eq: userCardId },
        },
        set: {
          last_sold_is_checked: true,
          last_sold_is_correct: true,
        },
      },
      onCompleted: ({ updateuser_cardsCollection }) => {
        if (updateuser_cardsCollection?.records?.length) {
          detailRefetch?.();
        }
      },
      onError: (error) => {
        console.log(error);
      },
    });
  }, [userCardId, updateCheckedLastSold, detailRefetch]);

  const handleConfirmIncorrect = useCallback(() => {
    router.push({
      pathname: '/screens/contact-us',
      params: { listingId },
    });
  }, [listingId]);

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
      <Label
        variant="subtitle"
        className={clsx(classes.name, { '-mt-7': !price })}
      >
        {title}
      </Label>
      <View className={classes.ebayRow}>
        <Image source={ChaamoLogo} className={classes.chaamoLogo} />
        <Label className={classes.priceValueLabel}>Price Value: </Label>
        <Label className={classes.priceValue}>{marketPriceDisplay}</Label>
        {!isCalculating && indicator && (
          <PriceIndicator direction={indicator} />
        )}
      </View>
      {!lastSoldIsChecked && user?.id === sellerId && (
        <View className={classes.actionContainer}>
          <Label className={classes.actionLabel}>
            What is this price value correct?
          </Label>
          <Row center className={classes.buttonActionContainer}>
            <Button
              variant="danger-light"
              size="small"
              className={classes.buttonAction}
              onPress={handleConfirmIncorrect}
              disabled={loading}
            >
              Incorrect
            </Button>
            <Button
              variant="primary-light"
              size="small"
              className={classes.buttonAction}
              onPress={handleConfirmCorrect}
              disabled={loading}
            >
              Correct
            </Button>
          </Row>
        </View>
      )}
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
  price: 'text-primary-500 text-xl font-bold',
  dateRow: 'gap-1.5',
  date: 'text-sm text-gray-400',
  name: 'text-lg font-semibold mt-1',
  ebayRow: 'flex-row items-center mt-1 gap-1',
  priceValueLabel: 'text-sm text-gray-500',
  priceValue: 'text-sm text-gray-700 font-bold',
  chaamoLogo: 'w-6 h-6 mr-1 mt-1',
  descriptionWrapper: 'mt-4',
  descriptionTitle: 'text-base font-semibold mb-1',
  description: 'text-base text-gray-700',
  actionContainer: 'gap-5 p-4.5 mt-3 bg-orange-100/60 rounded-xl',
  actionLabel: 'text-base font-normal text-center',
  buttonActionContainer: 'flex-row items-center gap-8',
  buttonAction: 'w-40',
};

export default ProductDetailInfo;
