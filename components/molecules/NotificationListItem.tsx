import { memo } from 'react';

import { formatDistanceToNow } from 'date-fns';
import { TouchableOpacity, View } from 'react-native';

import { Icon, Label, NotificationAction } from '@/components/atoms';
import { NotificationActionType } from '@/domains';
import { getColor } from '@/utils/getColor';

export interface NotificationCardProps {
  category: string;
  message: string;
  date: string;
  onPress: () => void;
  onLongPress: () => void;
  actions?: NotificationActionType[];
}

const NotificationCard: React.FC<NotificationCardProps> = memo(
  function NotificationCard({
    category,
    message,
    date,
    onPress,
    onLongPress,
    actions,
  }) {
    let time = formatDistanceToNow(new Date(date), {
      addSuffix: true,
      includeSeconds: true,
    });
    time = time.replace(/\babout\s+/i, '');

    // Map category names to appropriate icons
    const getIcon = (cat: string) => {
      const lowerCat = cat.toLowerCase();
      if (lowerCat.includes('shipped') || lowerCat.includes('order')) {
        return 'truck-outline';
      } else if (lowerCat.includes('bid')) {
        return 'cart-outline';
      } else if (lowerCat.includes('ending') || lowerCat.includes('time')) {
        return 'clock-outline';
      }
      return 'bell-outline'; // default icon
    };

    const icon = getIcon(category);

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
          <View className="flex-row gap-4 mt-3">
            {actions?.map((action) => (
              <NotificationAction
                key={action?.label}
                label={action?.label}
                actionKey={action?.action_key}
              />
            ))}
          </View>
        </View>
      </TouchableOpacity>
    );
  },
);

const classes = {
  container: 'flex-row items-center gap-3',
  iconContainer: 'bg-primary-100/30 rounded-full p-2 self-start',
  contentContainer: 'flex-1',
  categoryContainer: 'flex flex-row justify-between',
  time: 'text-slate-400',
  message: 'text-sm text-slate-500',
};

export default NotificationCard;
