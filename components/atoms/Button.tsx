import React, { memo, useMemo } from 'react';

import { clsx } from 'clsx';
import {
  ActivityIndicator,
  Text,
  TextProps,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from 'react-native';

import { getColor } from '@/utils/getColor';

import Icon from './Icon';

interface ButtonProps extends TouchableOpacityProps {
  variant?:
    | 'primary'
    | 'primary-light'
    | 'white'
    | 'white-light'
    | 'secondary'
    | 'danger'
    | 'danger-light'
    | 'light'
    | 'link'
    | 'ghost';
  size?: 'small' | 'medium' | 'large';
  children?: React.ReactNode;
  className?: string;
  textClassName?: string;
  textProps?: TextProps;
  disabled?: boolean;
  loading?: boolean;
  icon?: IconProp['name'];
  iconSize?: IconProp['size'];
  iconColor?: IconProp['color'];
  iconVariant?: IconProp['variant'];
  rightIcon?: IconProp['name'];
  rightIconSize?: IconProp['size'];
  rightIconColor?: IconProp['color'];
  rightIconVariant?: IconProp['variant'];
}

type IconProp = React.ComponentProps<typeof Icon>;

const Button: React.FC<ButtonProps> = memo(function Button({
  variant = 'primary',
  size = 'medium',
  children,
  className,
  textClassName,
  textProps,
  disabled = false,
  loading = false,
  icon,
  iconSize,
  iconColor,
  iconVariant,
  rightIcon,
  rightIconSize,
  rightIconColor,
  rightIconVariant,
  ...props
}) {
  const iconSizeBase = useMemo(() => {
    switch (size) {
      case 'small':
        return 16;
      case 'large':
        return 24;
      default:
        return 20;
    }
  }, [size]);

  const iconColorBase = useMemo(() => {
    switch (variant) {
      case 'link':
        return getColor('gray-600');
      case 'primary-light':
        return getColor('primary-500');
      case 'danger-light':
        return getColor('red-600');
      case 'light':
        return getColor('gray-600');
      case 'ghost':
        return getColor('gray-600');
      default:
        return getColor('white');
    }
  }, [variant]);

  return (
    <TouchableOpacity
      disabled={disabled}
      activeOpacity={0.5}
      className={clsx(
        classes.base,
        classes.size[size],
        classes.variant[variant],
        className,
        disabled && classes.disabled,
      )}
      {...props}
    >
      {!loading && icon && (
        <Icon
          name={icon}
          size={iconSize ?? iconSizeBase}
          variant={iconVariant}
          color={iconColor ?? iconColorBase}
        />
      )}
      {loading && (
        <View className={clsx(classes.loadingContainer)}>
          <ActivityIndicator color={iconColorBase} />
        </View>
      )}
      {children && (
        <Text
          className={clsx(
            classes.textBase,
            classes.textSize[size],
            loading ? classes.textTransparent : classes.textVariant[variant],
            textClassName,
          )}
          {...textProps}
        >
          {children}
        </Text>
      )}
      {!loading && rightIcon && (
        <Icon
          name={rightIcon}
          size={rightIconSize ?? iconSizeBase}
          variant={rightIconVariant}
          color={rightIconColor ?? iconColorBase}
        />
      )}
    </TouchableOpacity>
  );
});

const classes = {
  base: 'rounded-full flex flex-row items-center justify-center gap-1.5',
  textBase: 'text-base text-center',
  textTransparent: '!text-transparent',
  loadingContainer: 'flex items-center justify-center absolute z-10',
  disabled: 'opacity-60',
  variant: {
    primary: 'bg-primary-500',
    'primary-light': 'bg-transparent border border-primary-500',
    white: 'bg-white',
    'white-light': 'bg-transparent border border-white/70',
    secondary: 'bg-gray-200',
    danger: 'bg-red-600',
    'danger-light': 'bg-transparent border border-red-600',
    light: 'border border-gray-300',
    link: 'bg-transparent',
    ghost: 'bg-transparent',
  },
  size: {
    small: 'px-5 min-h-9',
    medium: 'px-6 py-3.5 min-w-24',
    large: 'px-10 py-4',
  },
  textVariant: {
    primary: 'text-white',
    'primary-light': 'text-primary-500',
    white: 'text-primary-500',
    'white-light': 'text-white',
    secondary: 'text-primary-500',
    danger: 'text-white',
    'danger-light': 'text-red-600',
    light: 'text-gray-600',
    link: 'text-gray-500 underline',
    ghost: 'text-gray-500',
  },
  textSize: {
    small: 'text-sm font-semibold',
    medium: 'text-base font-bold',
    large: 'text-lg font-bold',
  },
};

export default Button;
