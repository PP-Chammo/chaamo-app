import { memo, useMemo } from 'react';

import { clsx } from 'clsx';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { TouchableOpacity, View } from 'react-native';

import { Divider, Icon, Label, Row } from '@/components/atoms';
import { ListingType, OrderStatus } from '@/generated/graphql';
import { getColor } from '@/utils/getColor';
import { getFirstImageUrl } from '@/utils/imageUrls';

interface OrderItemProps {
  id: string;
  listingId: string;
  listingType: ListingType;
  title: string;
  price: string;
  imageUrls: string | string[] | null;
  status: OrderStatus;
}

const OrderItem: React.FC<OrderItemProps> = memo(function OrderItem({
  id,
  listingId,
  listingType,
  title,
  price,
  imageUrls,
  status,
}) {
  const imageUrl = getFirstImageUrl(imageUrls);
  const getIcon = useMemo(() => {
    const iconMap = {
      awaiting_payment: 'timer',
      awaiting_shipment: 'timer',
      shipped: 'truck',
      delivered: 'check',
      completed: 'check',
      refund_requested: 'close',
      refunded: 'close',
      cancelled: 'close',
    };
    return iconMap[status];
  }, [status]);

  const getColorIcon = useMemo(() => {
    if (status === 'cancelled') return getColor('red-500');
    return getColor('white');
  }, [status]);

  return (
    <View>
      <Row between>
        <Row className={classes.row}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() =>
              router.push({
                pathname: '/screens/listing-detail',
                params: {
                  id: listingId,
                  preview: 'true',
                },
              })
            }
            className={classes.imageContainer}
          >
            <Image
              source={{
                uri: imageUrl,
              }}
              className={classes.image}
              contentFit="cover"
            />
            <View
              className={clsx(classes.status[status], classes.statusContainer)}
            >
              <Icon name={getIcon} size={13} color={getColorIcon} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() =>
              router.push({
                pathname: '/screens/order-details',
                params: {
                  id,
                },
              })
            }
            className={classes.titleContainer}
          >
            <Label className={classes.title} numberOfLines={2}>
              {title}
            </Label>
            <Label className={classes.price}>{price}</Label>
          </TouchableOpacity>
          <Icon name="chevron-right" />
        </Row>
      </Row>
      <Divider position="horizontal" className={classes.divider} />
    </View>
  );
});

const classes = {
  row: 'gap-3',
  imageContainer: 'relative',
  image: 'w-16 aspect-[7/10] rounded relative',
  title: 'font-bold text-slate-800',
  price: 'text-sm font-medium',
  divider: 'my-3',
  statusContainer:
    'absolute -top-2 -right-2 p-1 border-px border-gray-200 rounded-full',
  status: {
    awaiting_payment: 'bg-yellow-500',
    awaiting_shipment: 'bg-yellow-500',
    shipped: 'bg-green-500',
    delivered: 'bg-green-500',
    completed: 'bg-green-500',
    refund_requested: 'bg-red-500',
    refunded: 'bg-red-500',
    cancelled: 'bg-red-500',
  },
  titleContainer: 'flex-1 gap-2',
};

export default OrderItem;
