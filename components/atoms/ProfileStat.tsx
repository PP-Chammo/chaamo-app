import { memo } from 'react';

import { clsx } from 'clsx';
import { Text, View } from 'react-native';

interface ProfileStatProps {
  title: string;
  value: string;
  className?: string;
}

const ProfileStat: React.FC<ProfileStatProps> = memo(function ProfileStat({
  title,
  value,
  className,
}) {
  return (
    <View className={clsx(classes.container, className)}>
      <Text className={classes.value}>{value}</Text>
      <Text className={classes.title}>{title}</Text>
    </View>
  );
});

const classes = {
  container: 'items-center',
  value: 'text-lg text-slate-700 font-bold',
  title: 'text-md text-slate-500',
};

export default ProfileStat;
