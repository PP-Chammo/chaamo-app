import { memo } from 'react';

import { formatDistanceToNow } from 'date-fns';
import { TouchableOpacity, View } from 'react-native';

import { Icon, Label } from '@/components/atoms';
import { getColor } from '@/utils/getColor';

export interface NotificationCardProps {
  category: 'Order Shipped' | 'New Bid' | 'Bid Ending';
  message: string;
  date: string;
  onPress: () => void;
  onLongPress: () => void;
}

const NotificationCard: React.FC<NotificationCardProps> = memo(
  function NotificationCard({ category, message, date, onPress, onLongPress }) {
    let time = formatDistanceToNow(new Date(date), {
      addSuffix: true,
      includeSeconds: true,
    });
    time = time.replace(/\babout\s+/i, '');

    const icon =
      category === 'Order Shipped'
        ? 'truck-outline'
        : category === 'New Bid'
          ? 'cart-outline'
          : 'clock-outline';
    return (
      <TouchableOpacity
        testID="notification-list-item"
        onPress={onPress}
        className={classes.container}
        onLongPress={onLongPress}
      >
        <View className={classes.iconContainer}>
          <Icon name={icon} size={24} color={getColor('primary-500')} />
        </View>
        <View className={classes.contentContainer}>
          <View className={classes.categoryContainer}>
            <Label variant="subtitle">{category}</Label>
            <Label className={classes.time}>{time}</Label>
          </View>
          <Label className={classes.message}>{message}</Label>
        </View>
      </TouchableOpacity>
    );
  },
);

const classes = {
  container: 'flex-row items-center gap-3',
  iconContainer: 'bg-primary-100/30 rounded-full p-2',
  contentContainer: 'flex-1',
  categoryContainer: 'flex flex-row justify-between',
  time: 'text-slate-400',
  message: 'text-sm text-slate-500',
};

export default NotificationCard;
