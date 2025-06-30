import { memo } from 'react';

import { clsx } from 'clsx';
import { TouchableOpacity, View } from 'react-native';

import { Icon, Label } from '@/components/atoms';

interface ButtonIconProps {
  name: IconProp['name'];
  onPress: () => void;
  iconSize?: IconProp['size'];
  color?: IconProp['color'];
  className?: string;
  count?: string | number;
}

type IconProp = React.ComponentProps<typeof Icon>;

const ButtonIcon = memo(function ButtonIcon({
  name,
  onPress,
  iconSize = 28,
  color = 'black',
  className,
  count,
}: ButtonIconProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={clsx(classes.container, className)}
    >
      <Icon name={name} size={iconSize} color={color} />
      {count && (
        <View className={classes.countContainer}>
          <Label className={classes.countText}>{count}</Label>
        </View>
      )}
    </TouchableOpacity>
  );
});

const classes = {
  container: 'p-2 rounded-full',
  countContainer:
    'absolute top-0 right-0 flex items-center justify-center bg-teal-500 w-5 h-5 rounded-full',
  countText: 'text-white text-xs font-semibold',
};

export default ButtonIcon;
