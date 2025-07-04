import { ScrollView, View } from 'react-native';

import { Icon, Label } from '@/components/atoms';
import { Rating, Review } from '@/components/molecules';

export default function ReviewsScreen() {
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      className={classes.container}
    >
      <View className={classes.reviewContainer}>
        <Rating value={4.8} />
        <Label variant="subtitle">4.8 (200 Reviews)</Label>
        <Label className={classes.outstandingText}>
          Outstanding: Rated 4.8 with 2 reviews
        </Label>
      </View>
      <View className={classes.reviewHeader}>
        <Label variant="subtitle">3 Reviews</Label>
        <View className={classes.reviewHeaderRight}>
          <Label>Latest</Label>
          <Icon name="chevron-down" size={16} color="black" />
        </View>
      </View>
      <View className={classes.reviewList}>
        <Review
          name="John Doe"
          rating={4.8}
          comment="Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos."
        />
        <Review
          name="John Doe"
          rating={4.8}
          comment="Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos."
        />
        <Review
          name="John Doe"
          rating={4.8}
          comment="Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos."
        />
      </View>
    </ScrollView>
  );
}

const classes = {
  container: 'flex-1',
  reviewContainer: 'bg-white items-center justify-between gap-2 p-5',
  outstandingText: 'text-sm text-slate-500',
  reviewHeader: 'flex flex-row items-center justify-between my-5',
  reviewHeaderRight:
    'bg-white flex-row items-center gap-2 py-1 px-4 rounded-lg',
  reviewList: 'gap-5 mb-5',
};
