import React from 'react';

import { clsx } from 'clsx';
import {
  Text,
  TextProps,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';

interface ButtonProps extends TouchableOpacityProps {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
  children: React.ReactNode;
  className?: string;
  textClassName?: string;
  textProps?: TextProps;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  children,
  className,
  textClassName,
  textProps,
  ...props
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.6}
      className={clsx(classes.base, classes.variant[variant], className)}
      {...props}
    >
      <Text
        className={clsx(
          classes.textBase,
          classes.size[size],
          classes.textVariant[variant],
          textClassName,
        )}
        {...textProps}
      >
        {children}
      </Text>
    </TouchableOpacity>
  );
};

const classes = {
  base: 'rounded-full items-center justify-center',
  textBase: 'text-base text-center',
  variant: {
    primary: 'bg-teal-500',
    secondary: 'bg-gray-200',
    danger: 'bg-red-600',
  },
  textVariant: {
    primary: 'text-white',
    secondary: 'text-teal-500',
    danger: 'text-white',
  },
  size: {
    small: 'px-5 py-2.5 text-sm font-semibold',
    medium: 'px-6 py-3.5 text-base font-bold min-w-28',
    large: 'px-10 py-4 text-lg font-bold',
  },
};

export default Button;
