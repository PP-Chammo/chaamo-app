import { View } from 'react-native';

import { Label } from '@/components/atoms';

export default function ExploreScreen() {
  return (
    <View className={classes.container}>
      <Label>Explore Screen</Label>
    </View>
  );
}

const classes = {
  container: 'flex-1 items-center justify-center',
};
