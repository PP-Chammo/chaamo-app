import React, { memo, useMemo } from 'react';

import { clsx } from 'clsx';
import {
  ActivityIndicator,
  Text,
  TextProps,
  TouchableOpacity,
  TouchableOpacityProps,
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
    | 'light'
    | 'link'
    | 'ghost';
  size?: 'small' | 'medium' | 'large';
  children: React.ReactNode;
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
      {loading ? (
        <ActivityIndicator color={iconColorBase} />
      ) : (
        <>
          {icon && (
            <Icon
              name={icon}
              size={iconSize ?? iconSizeBase}
              variant={iconVariant}
              color={iconColor ?? iconColorBase}
            />
          )}
          <Text
            className={clsx(
              classes.textBase,
              classes.textSize[size],
              classes.textVariant[variant],
              textClassName,
            )}
            {...textProps}
          >
            {children}
          </Text>
          {rightIcon && (
            <Icon
              name={rightIcon}
              size={rightIconSize ?? iconSizeBase}
              variant={rightIconVariant}
              color={rightIconColor ?? iconColorBase}
            />
          )}
        </>
      )}
    </TouchableOpacity>
  );
});

const classes = {
  base: 'rounded-full flex flex-row items-center justify-center gap-1.5',
  textBase: 'text-base text-center',
  disabled: 'opacity-50',
  variant: {
    primary: 'bg-primary-500',
    'primary-light': 'bg-transparent border border-primary-500',
    white: 'bg-white',
    'white-light': 'bg-transparent border border-white/70',
    secondary: 'bg-gray-200',
    danger: 'bg-red-600',
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
