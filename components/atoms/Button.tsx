import React, { memo, useMemo } from 'react';

import { clsx } from 'clsx';
import {
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
    | 'secondary'
    | 'danger'
    | 'light'
    | 'link';
  size?: 'small' | 'medium' | 'large';
  children: React.ReactNode;
  className?: string;
  textClassName?: string;
  textProps?: TextProps;
  disabled?: boolean;
  icon?: IconProp['name'];
  iconVariant?: IconProp['variant'];
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
  icon,
  iconVariant,
  ...props
}) {
  const iconSize = useMemo(() => {
    switch (size) {
      case 'small':
        return 16;
      case 'large':
        return 24;
      default:
        return 20;
    }
  }, [size]);

  const iconColor = useMemo(() => {
    switch (variant) {
      case 'link':
        return getColor('gray-600');
      case 'primary-light':
        return getColor('teal-600');
      case 'light':
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
      {icon && (
        <Icon
          name={icon}
          size={iconSize}
          variant={iconVariant}
          color={iconColor}
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
    </TouchableOpacity>
  );
});

const classes = {
  base: 'rounded-full flex flex-row items-center justify-center gap-2',
  textBase: 'text-base text-center',
  disabled: 'opacity-50',
  variant: {
    primary: 'bg-teal-500',
    'primary-light': 'bg-teal-100/40 border border-teal-500',
    secondary: 'bg-gray-200',
    danger: 'bg-red-600',
    light: 'bg-white border border-gray-300',
    link: 'bg-transparent',
  },
  textVariant: {
    primary: 'text-white',
    'primary-light': 'text-teal-600',
    secondary: 'text-teal-500',
    danger: 'text-white',
    light: 'text-gray-600',
    link: 'text-gray-500 underline',
  },
  size: {
    small: 'px-5 min-h-9',
    medium: 'px-6 py-3.5 min-w-28',
    large: 'px-10 py-4',
  },
  textSize: {
    small: 'text-sm font-semibold',
    medium: 'text-base font-bold min-w-28',
    large: 'text-lg font-bold',
  },
};

export default Button;
