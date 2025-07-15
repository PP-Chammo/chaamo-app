import { memo, useMemo } from 'react';

import { clsx } from 'clsx';
import { router } from 'expo-router';
import { Image, TouchableOpacity, View } from 'react-native';

import { Divider, Icon, Label, Row } from '@/components/atoms';
import { getColor } from '@/utils/getColor';

export type OrderStatus = 'progress' | 'completed' | 'cancelled';

interface OrderItemProps {
  title: string;
  price: string;
  imageUrl: string;
  status: OrderStatus;
}

const OrderItem: React.FC<OrderItemProps> = memo(function OrderItem({
  title,
  price,
  imageUrl,
  status,
}) {
  const getIcon = useMemo(() => {
    if (status === 'cancelled') return 'close';
    return 'check';
  }, [status]);

  const getColorIcon = useMemo(() => {
    if (status === 'cancelled') return getColor('red-500');
    return getColor('white');
  }, [status]);

  return (
    <TouchableOpacity onPress={() => router.push('/screens/order-details')}>
      <Row between>
        <Row className={classes.row}>
          <View className={classes.imageContainer}>
            <Image
              source={{
                uri: imageUrl,
              }}
              className={classes.image}
              resizeMode="cover"
            />
            <View className={classes.statusContainer}>
              <View
                className={clsx(classes.status[status], classes.status.base)}
              >
                <Icon name={getIcon} size={13} color={getColorIcon} />
              </View>
            </View>
          </View>
          <View>
            <Label className={classes.title}>{title}</Label>
            <Label className={classes.price}>${price}</Label>
          </View>
        </Row>
        <Icon name="chevron-right" />
      </Row>
      <Divider position="horizontal" className={classes.divider} />
    </TouchableOpacity>
  );
});

const classes = {
  row: 'gap-3',
  imageContainer: 'relative',
  image: 'w-14 h-20 rounded relative',
  title: 'font-bold text-slate-800',
  price: 'text-sm',
  divider: 'my-3',
  statusContainer: 'absolute -top-2 -right-2 bg-white p-1 rounded-full',
  status: {
    base: 'rounded-full p-1',
    progress: 'bg-black/20',
    completed: 'bg-green-500',
    cancelled: 'bg-white',
  },
};

export default OrderItem;
