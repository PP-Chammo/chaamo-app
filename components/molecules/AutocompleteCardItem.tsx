import { memo } from 'react';

import { clsx } from 'clsx';
import { Image } from 'expo-image';
import { TouchableOpacity, View } from 'react-native';

import { Label } from '@/components/atoms';

interface AutocompleteCardItemProps {
  onPress: () => void;
  className?: string;
  name: string;
  imageUrl?: string;
  category?: string;
}

const AutocompleteCardItem = memo(function AutocompleteItem({
  onPress,
  className,
  name,
  imageUrl,
  category,
}: AutocompleteCardItemProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className={clsx(classes.container, className)}
    >
      {imageUrl && (
        <Image source={{ uri: imageUrl }} className={classes.image} />
      )}
      <View className={classes.infoContainer}>
        <Label className={classes.name}>{name}</Label>
        {category && <Label className={classes.category}>{category}</Label>}
      </View>
    </TouchableOpacity>
  );
});

const classes = {
  container: 'flex flex-row gap-3 bg-white rounded-lg p-3',
  image: 'w-14 aspect-[5/7] rounded',
  infoContainer: 'flex-1 justify-between py-1',
  name: 'text-sm font-medium',
  category: 'text-xs text-slate-500',
};

export default AutocompleteCardItem;
