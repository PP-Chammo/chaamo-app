import { memo } from 'react';

import { TouchableOpacity, View } from 'react-native';

import { Icon, Label } from '@/components/atoms';
import { getColor } from '@/utils/getColor';

export interface NotificationCardProps {
  category: 'Order Shipped' | 'New Bid' | 'Bid Ending';
  message: string;
  date: string;
  onPress: () => void;
}

const NotificationCard: React.FC<NotificationCardProps> = memo(
  function NotificationCard({ category, message, date }) {
    return (
      <TouchableOpacity className={classes.container}>
        <View className={classes.iconContainer}>
          <Icon name="truck-outline" size={24} color={getColor('teal-600')} />
        </View>
        <View className={classes.contentContainer}>
          <View className={classes.categoryContainer}>
            <Label variant="subtitle">{category}</Label>
            <Label className={classes.time}>1h</Label>
          </View>
          <Label className={classes.message}>{message}</Label>
        </View>
      </TouchableOpacity>
    );
  },
);

const classes = {
  container: 'flex-row items-center gap-3',
  iconContainer: 'bg-teal-100/30 rounded-full p-2',
  contentContainer: 'flex-1',
  categoryContainer: 'flex flex-row justify-between',
  time: 'text-slate-400',
  message: 'text-sm text-slate-500',
};

export default NotificationCard;
