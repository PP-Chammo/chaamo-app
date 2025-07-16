import { memo } from 'react';

import { MaterialCommunityIcons } from '@expo/vector-icons';

import { Icon } from '@/components/atoms';
import { getColor } from '@/utils/getColor';

interface PriceIndicatorProps extends React.ComponentProps<typeof Icon> {
  direction: string;
  size?: number;
}

const PriceIndicator: React.FC<PriceIndicatorProps> = memo(
  function PriceIndicator({ direction, size = 16, ...props }) {
    return (
      <MaterialCommunityIcons
        name={direction === 'up' ? 'trending-up' : 'trending-down'}
        color={getColor(direction === 'up' ? 'primary-500' : 'red-600')}
        size={size}
        {...props}
      />
    );
  },
);

export default PriceIndicator;
