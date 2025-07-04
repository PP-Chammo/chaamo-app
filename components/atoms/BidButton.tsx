import { memo } from 'react';

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { clsx } from 'clsx';
import { TouchableOpacity } from 'react-native';

import { getColor } from '@/utils/getColor';

export interface BidButtonProps {
  onPress: () => void;
  enabled?: boolean;
  iconSize?: number;
  className?: string;
}

export const BidButton: React.FC<BidButtonProps> = memo(function BidButton({
  enabled,
  onPress,
  iconSize = 16,
  className,
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={clsx(classes.button, className)}
    >
      <MaterialCommunityIcons
        name="fingerprint"
        size={iconSize}
        color={getColor(enabled ? 'white' : 'black')}
      />
    </TouchableOpacity>
  );
});

const classes = {
  button:
    'absolute top-2 right-2 z-10 w-7 h-7 flex items-center justify-center bg-white rounded-full shadow-md hover:bg-gray-100 focus:outline-none',
};

export default BidButton;
