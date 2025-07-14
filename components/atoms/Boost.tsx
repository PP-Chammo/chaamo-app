import { memo } from 'react';

import { clsx } from 'clsx';
import { View } from 'react-native';

import { BoostIcon } from '@/assets/svg';
import { getColor } from '@/utils/getColor';

export interface BoostProps {
  boosted?: boolean;
}

const Boost: React.FC<BoostProps> = memo(function Boost({ boosted }) {
  return (
    <View
      testID="boost"
      className={clsx(
        classes.container,
        classes[boosted ? 'boosted' : 'unboosted'],
      )}
    >
      <BoostIcon color={getColor(boosted ? 'white' : 'black')} />
    </View>
  );
});

const classes = {
  container:
    'absolute top-2 right-2 z-10 w-8 h-8 flex items-center justify-center rounded-full shadow-md hover:bg-gray-100 focus:outline-none',
  boosted: 'bg-primary-500',
  unboosted: 'bg-white',
};

export default Boost;
