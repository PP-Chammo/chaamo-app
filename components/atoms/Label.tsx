import React from 'react';

import { clsx } from 'clsx';
import { Text, TextProps } from 'react-native';

interface LabelProps extends TextProps {
  variant?: 'title' | 'subtitle';
  children: React.ReactNode;
  className?: string;
}

const Label: React.FC<LabelProps> = ({
  variant,
  children,
  className = classes.base,
  ...props
}) => (
  <Text
    className={clsx(classes.variant[variant ?? 'default'], className)}
    {...props}
  >
    {children}
  </Text>
);

const classes = {
  base: 'text-base text-neutral-900',
  variant: {
    default: 'text-base text-neutral-900 dark:text-neutral-100',
    title: 'text-3xl font-bold text-gray-900 dark:text-gray-100',
    subtitle: 'text-lg font-semibold text-gray-900 dark:text-gray-100',
  },
};

export default Label;
