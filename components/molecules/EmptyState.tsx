import React, { memo } from 'react';

import { clsx } from 'clsx';
import { View } from 'react-native';

import { Icon, Label } from '@/components/atoms';
import { getColor } from '@/utils/getColor';

interface EmptyStateProps {
  iconName: string;
  iconVariant?: string;
  iconSize?: number;
  iconColor?: string;
  message: string;
  className?: string;
  iconClassName?: string;
  messageClassName?: string;
}

const EmptyState = memo(function EmptyState({
  iconName,
  iconVariant = 'MaterialCommunityIcons',
  iconSize = 65,
  iconColor = getColor('primary-100'),
  message,
  className,
  iconClassName,
  messageClassName,
}: EmptyStateProps) {
  return (
    <View className={clsx(className, classes.container)}>
      <Icon
        variant={iconVariant}
        name={iconName}
        size={iconSize}
        color={iconColor}
        className={iconClassName}
      />
      <Label className={clsx(messageClassName, classes.message)}>
        {message}
      </Label>
    </View>
  );
});

const classes = {
  container: 'flex-1 items-center justify-center',
  message: '!text-lg mt-5 text-slate-400',
};

export default EmptyState;
