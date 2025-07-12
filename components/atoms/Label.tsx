import React, { memo } from 'react';

import { clsx } from 'clsx';
import { Text, TextProps } from 'react-native';

interface LabelProps extends TextProps {
  variant?: 'title' | 'subtitle';
  children: React.ReactNode;
  className?: string;
}

const Label: React.FC<LabelProps> = memo(function Label({
  variant,
  children,
  className,
  ...props
}) {
  return (
    <Text
      className={clsx(classes.variant[variant ?? 'default'], className)}
      {...props}
    >
      {children}
    </Text>
  );
});

const classes = {
  variant: {
    default: 'text-base text-neutral-600 dark:text-neutral-600',
    title: 'text-xl font-bold text-gray-600 dark:text-gray-600',
    subtitle: 'text-lg font-semibold text-gray-600 dark:text-gray-600',
  },
};

export default Label;
