import { clsx } from 'clsx';
import { Text, TouchableOpacity } from 'react-native';

import { notificationActionKeys } from '@/constants/notificationTemplates';

interface NotificationActionProps {
  label: string;
  actionKey: (typeof notificationActionKeys)[keyof typeof notificationActionKeys];
}

const NotificationAction: React.FC<NotificationActionProps> = ({
  label,
  actionKey,
}) => {
  const { ACCEPT_OFFER, DECLINE_OFFER } = notificationActionKeys;

  const danger = [DECLINE_OFFER].includes(actionKey);
  const primary = [ACCEPT_OFFER].includes(actionKey);

  return (
    <TouchableOpacity
      className={clsx(classes.container, {
        [classes.danger]: danger,
        [classes.primary]: primary,
        [classes.secondary]: !danger && !primary,
      })}
    >
      <Text
        className={clsx({
          [classes.dangerText]: danger,
          [classes.primaryText]: primary,
          [classes.secondaryText]: !danger && !primary,
        })}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

export default NotificationAction;

const classes = {
  container: 'flex-row items-center gap-3 border-[0.2px] p-2 rounded-lg',
  danger: 'border-red-500',
  primary: 'border-primary-500',
  secondary: 'border-slate-400',
  dangerText: 'text-red-500',
  primaryText: 'text-primary-500',
  secondaryText: 'text-slate-500',
};
