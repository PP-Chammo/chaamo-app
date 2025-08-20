import React, { memo, useMemo } from 'react';

import { clsx } from 'clsx';
import { Image } from 'expo-image';
import { View } from 'react-native';

import Button from '@/components/atoms/Button';
import Label from '@/components/atoms/Label';
import { useGetVwChaamoDetailQuery } from '@/generated/graphql';
import { useCurrencyDisplay } from '@/hooks/useCurrencyDisplay';

interface MessageListingDetailProps {
  listingId: string;
  onDetailPress?: () => void;
  className?: string;
  imageClassName?: string;
}

const MessageListingDetail: React.FC<MessageListingDetailProps> = memo(
  function MessageListingDetail({
    listingId,
    onDetailPress,
    className,
    imageClassName,
  }) {
    const { data } = useGetVwChaamoDetailQuery({
      skip: !listingId,
      variables: { filter: { id: { eq: listingId } } },
    });

    const detail = data?.vw_chaamo_cardsCollection?.edges?.[0]?.node;
    const { formatDisplay } = useCurrencyDisplay();

    const priceDisplay = useMemo(
      () => formatDisplay(detail?.currency, detail?.start_price ?? 0),
      [detail?.currency, detail?.start_price, formatDisplay],
    );

    if (!detail) return null;

    return (
      <View
        testID="message-listing-detail"
        className={clsx(classes.container, className)}
      >
        <View className={classes.topRow}>
          {detail.image_url ? (
            <Image
              source={{ uri: detail.image_url }}
              className={clsx(classes.image, imageClassName)}
            />
          ) : (
            <View className={clsx(classes.image, imageClassName)} />
          )}

          <View className={classes.textContainer}>
            <Label className={classes.title} numberOfLines={3}>
              {detail.name}
            </Label>
            <Label className={classes.price}>{priceDisplay}</Label>
          </View>
        </View>

        <Button
          size="small"
          variant="primary-light"
          onPress={onDetailPress}
          className={classes.button}
          textClassName={classes.buttonText}
          testID="message-listing-detail-button"
        >
          See Details
        </Button>
      </View>
    );
  },
);

export default MessageListingDetail;

const classes = {
  container: 'w-full rounded-xl p-1 gap-3 pb-5',
  topRow: 'flex-row items-center gap-3',
  image: 'w-16 aspect-[7/10] rounded bg-gray-200',
  textContainer: 'flex-1',
  title: 'text-slate-800 font-semibold',
  price: 'text-slate-600',
  button: 'w-full mt-1',
  buttonText: 'font-semibold',
};
