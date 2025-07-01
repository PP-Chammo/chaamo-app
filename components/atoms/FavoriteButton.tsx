import { memo } from 'react';

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { clsx } from 'clsx';
import { TouchableOpacity } from 'react-native';

import { getColor } from '@/utils/getColor';

export interface FavoriteButtonProps {
  onPress: () => void;
  enabled?: boolean;
  iconSize?: number;
  className?: string;
}

export const FavoriteButton: React.FC<FavoriteButtonProps> = memo(
  function FavoriteButton({ enabled, onPress, iconSize = 16, className }) {
    return (
      <TouchableOpacity
        onPress={onPress}
        className={clsx(classes.button, className)}
      >
        <MaterialCommunityIcons
          name={enabled ? 'heart' : 'heart-outline'}
          size={iconSize}
          color={getColor(enabled ? 'red-600' : 'black')}
        />
      </TouchableOpacity>
    );
  },
);

const classes = {
  button:
    'absolute top-2 right-2 z-10 w-7 h-7 flex items-center justify-center bg-white rounded-full shadow-md hover:bg-gray-100 focus:outline-none',
};

export default FavoriteButton;
