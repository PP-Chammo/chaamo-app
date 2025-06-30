import { memo } from 'react';

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { clsx } from 'clsx';
import { View } from 'react-native';

import { getColor } from '@/utils/getColor';

interface BadgeProps {
  className?: string;
}

const Badge: React.FC<BadgeProps> = memo(function Badge({ className }) {
  return (
    <View className={clsx(classes.container, className)}>
      <MaterialCommunityIcons name="star" size={14} color={getColor('white')} />
    </View>
  );
});

const classes = {
  container:
    'z-10 h-9 bg-orange-400 absolute top-0 left-2 px-1 pb-2 flex flex-col justify-end rounded-b',
};

export default Badge;
