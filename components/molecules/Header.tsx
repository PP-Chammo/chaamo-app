import React, { memo } from 'react';

import { clsx } from 'clsx';
import { Text, TouchableOpacity, View } from 'react-native';

import { Icon } from '@/components/atoms';
import { getColor } from '@/utils/getColor';

interface HeaderProps {
  title: string;
  onBackPress?: () => void;
  className?: string;
}

const Header: React.FC<HeaderProps> = memo(function Header({
  title,
  onBackPress,
  className,
}) {
  return (
    <View className={clsx(classes.header, className)}>
      {onBackPress && (
        <TouchableOpacity onPress={onBackPress} className={classes.backButton}>
          <Icon name="arrow-left" size={24} color={getColor('slate-700')} />
        </TouchableOpacity>
      )}
      <Text className={classes.title}>{title}</Text>
      {onBackPress && <View className={classes.rightSpace} />}
    </View>
  );
});

const classes = {
  header:
    'flex-row items-center h-[64] bg-transparent border-b-0 justify-between',
  backButton: 'w-10 items-start justify-center',
  title: 'flex-1 text-center text-lg font-medium text-gray-800',
  rightSpace: 'w-10',
};

export default Header;
