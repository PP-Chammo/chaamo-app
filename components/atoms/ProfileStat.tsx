import { memo } from 'react';

import { clsx } from 'clsx';
import { Pressable, PressableProps, Text } from 'react-native';

interface ProfileStatProps extends PressableProps {
  title: string;
  value: string;
  className?: string;
  onPress?: () => void;
}

const ProfileStat: React.FC<ProfileStatProps> = memo(function ProfileStat({
  title,
  value,
  className,
  onPress,
  ...props
}) {
  return (
    <Pressable
      onPress={onPress}
      className={clsx(classes.container, className)}
      {...props}
    >
      <Text className={classes.value}>{value}</Text>
      <Text className={classes.title}>{title}</Text>
    </Pressable>
  );
});

const classes = {
  container: 'items-center',
  value: 'text-lg text-slate-700 font-bold',
  title: 'text-md text-slate-500',
};

export default ProfileStat;
