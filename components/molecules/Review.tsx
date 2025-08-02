import { memo } from 'react';

import { View } from 'react-native';

import { Avatar, Icon, Label } from '@/components/atoms';
import { getColor } from '@/utils/getColor';

interface ReviewProps {
  name: string;
  imageUrl?: string;
  rating: number;
  comment: string;
}

const Review: React.FC<ReviewProps> = memo(function Review({
  name,
  imageUrl,
  rating,
  comment,
}) {
  return (
    <View testID="review-item" className={classes.container}>
      <View className={classes.header}>
        <View className={classes.imageContainer}>
          <Avatar testID="avatar" imageUrl={imageUrl} size="sm" />
          <Label variant="subtitle" className={classes.name}>
            {name}
          </Label>
        </View>
        <View className={classes.ratingContainer}>
          <Icon
            testID="star-icon"
            name="star"
            size={16}
            color={getColor('amber-500')}
          />
          <Label>{rating}</Label>
        </View>
      </View>
      <Label className={classes.comment}>{comment}</Label>
    </View>
  );
});

const classes = {
  container: 'bg-white p-5 rounded-lg border border-primary-100',
  imageContainer: 'flex flex-row items-center gap-3',
  name: 'text-base',
  header: 'flex flex-row items-center justify-between',
  ratingContainer: 'flex flex-row items-center gap-1',
  comment: 'text-sm text-slate-500 mt-3',
};

export default Review;
