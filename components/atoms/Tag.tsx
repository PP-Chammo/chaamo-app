import { memo } from 'react';

import { clsx } from 'clsx';
import { Text, View } from 'react-native';

interface TagProps {
  title: string;
  className?: string;
  textClassName?: string;
}

const Tag: React.FC<TagProps> = memo(function Badge({
  title,
  className,
  textClassName,
}) {
  return (
    <View className={clsx(classes.container, className)}>
      <Text className={clsx(classes.title, textClassName)}>{title}</Text>
    </View>
  );
});

const classes = {
  container: 'bg-teal-100/50 py-1 px-1.5 self-start rounded',
  title: 'text-xs text-teal-600',
};

export default Tag;
