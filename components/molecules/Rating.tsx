import React, { memo } from 'react';

import { View } from 'react-native';

import { Icon } from '@/components/atoms';
import { getColor } from '@/utils/getColor';

interface RatingProps {
  value: number;
  size?: number;
  className?: string;
}

const Rating: React.FC<RatingProps> = memo(function Rating({
  value,
  size = 20,
  className,
}) {
  const maxStars = 5;
  const stars = [];
  for (let i = 1; i <= maxStars; i++) {
    let iconName = 'star';
    if (i > value) {
      iconName = i - value <= 0.5 ? 'star-half-full' : 'star-outline';
    }
    stars.push(
      <Icon
        key={i}
        name={iconName}
        variant="MaterialCommunityIcons"
        size={size}
        color={getColor('amber-500')}
        className={className}
      />,
    );
  }
  return <View className={classes.container}>{stars}</View>;
});

const classes = {
  container: 'flex-row items-center',
};

export default Rating;
