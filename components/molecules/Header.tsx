import React, { memo } from 'react';

import { clsx } from 'clsx';
import { Text, TouchableOpacity, View } from 'react-native';

import { Icon } from '@/components/atoms';
import { getColor } from '@/utils/getColor';

interface HeaderProps {
  title?: string;
  onBackPress?: () => void;
  onRightPress?: () => void;
  className?: string;
  iconRight?: IconProp['name'];
  iconRightColor?: IconProp['color'];
  iconRightSize?: IconProp['size'];
  leftComponent?: React.ReactNode;
}

type IconProp = React.ComponentProps<typeof Icon>;

const Header: React.FC<HeaderProps> = memo(function Header({
  title,
  leftComponent,
  onBackPress,
  onRightPress,
  className,
  iconRight,
  iconRightColor,
  iconRightSize,
}) {
  return (
    <View className={clsx(classes.header, className)}>
      {onBackPress && (
        <TouchableOpacity
          onPress={onBackPress}
          className={classes.buttonContainerLeft}
        >
          <Icon name="arrow-left" size={24} color={getColor('slate-700')} />
        </TouchableOpacity>
      )}
      {leftComponent}
      <Text className={classes.title}>{title}</Text>
      {onRightPress && (
        <View className={classes.buttonContainerRight}>
          <TouchableOpacity onPress={onRightPress}>
            {iconRight && (
              <Icon
                name={iconRight}
                size={iconRightSize ?? 24}
                color={iconRightColor}
              />
            )}
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
});

const classes = {
  header:
    'flex-row items-center h-20 bg-transparent border-b-0 justify-between px-5',
  buttonContainerLeft: 'w-10 h-10 items-start justify-center',
  buttonContainerRight: 'w-10 h-10 items-end justify-center',
  title: 'flex-1 text-center text-lg font-semibold text-gray-800',
};

export default Header;
