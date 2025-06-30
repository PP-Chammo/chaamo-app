import { memo } from 'react';

import { clsx } from 'clsx';
import { Text, View } from 'react-native';

interface TagProps {
  title: string;
  className?: string;
}

const Tag: React.FC<TagProps> = memo(function Badge({ title, className }) {
  return (
    <View className={clsx(classes.container, className)}>
      <Text className={classes.title}>{title}</Text>
    </View>
  );
});

const classes = {
  container: 'bg-teal-100/50 py-1 px-1.5 self-start rounded',
  title: 'text-sm text-teal-600',
};

export default Tag;
