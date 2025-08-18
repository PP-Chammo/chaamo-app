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
  leftIconColor?: IconProp['color'];
  rightRef?: React.RefObject<View | null>;
}

type IconProp = React.ComponentProps<typeof Icon>;

const Header: React.FC<HeaderProps> = memo(function Header({
  title,
  leftComponent,
  onBackPress,
  onRightPress,
  className,
  leftIconColor,
  rightIcon,
  rightIconColor,
  rightIconSize,
  rightRef,
}) {
  return (
    <View testID="header" className={clsx(classes.header, className)}>
      {onBackPress ? (
        <TouchableOpacity
          testID="back-button"
          onPress={onBackPress}
          className={classes.buttonContainerLeft}
        >
          <Icon
            name="arrow-left"
            size={24}
            color={getColor(leftIconColor ?? 'slate-700')}
          />
        </TouchableOpacity>
      ) : (
        <View className={classes.buttonContainerLeft} />
      )}
      {leftComponent}
      <Text className={classes.title}>{title}</Text>
      {onRightPress ? (
        <TouchableOpacity
          testID="right-button"
          onPress={onRightPress}
          ref={rightRef}
          className={classes.buttonContainerRight}
        >
          {rightIcon && (
            <Icon
              name={rightIcon}
              size={rightIconSize ?? 24}
              color={rightIconColor}
            />
          )}
        </TouchableOpacity>
      ) : (
        <View className={classes.buttonContainerRight} />
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
  rightSpace: 'w-10 h-10 items-end justify-center',
};

export default Header;
