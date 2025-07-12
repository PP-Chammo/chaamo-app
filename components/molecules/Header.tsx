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
  rightIcon?: IconProp['name'];
  rightIconColor?: IconProp['color'];
  rightIconSize?: IconProp['size'];
  leftComponent?: React.ReactNode;
  rightRef?: React.RefObject<View | null>;
}

type IconProp = React.ComponentProps<typeof Icon>;

const Header: React.FC<HeaderProps> = memo(function Header({
  title,
  leftComponent,
  onBackPress,
  onRightPress,
  className,
  rightIcon,
  rightIconColor,
  rightIconSize,
  rightRef,
}) {
  return (
    <View testID="header" className={clsx(classes.header, className)}>
      {onBackPress && (
        <TouchableOpacity
          testID="back-button"
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
          <TouchableOpacity
            testID="right-button"
            onPress={onRightPress}
            ref={rightRef}
          >
            {rightIcon && (
              <Icon
                name={rightIcon}
                size={rightIconSize ?? 24}
                color={rightIconColor}
              />
            )}
          </TouchableOpacity>
        </View>
      )}
      {onBackPress && !onRightPress && <View className={classes.rightSpace} />}
    </View>
  );
});

const classes = {
  header:
    'flex-row items-center h-20 bg-transparent border-b-0 justify-between px-5',
  buttonContainerLeft: 'w-10 h-10 items-start justify-center',
  buttonContainerRight: 'w-10 h-10 items-end justify-center',
  title: 'flex-1 text-center text-lg font-semibold text-gray-800',
  rightSpace: 'w-10 h-10 items-end justify-center',
};

export default Header;
