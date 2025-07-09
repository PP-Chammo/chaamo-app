import { router } from 'expo-router';
import { View } from 'react-native';

import { Label, ScreenContainer } from '@/components/atoms';

export default function NotFoundScreen() {
  return (
    <ScreenContainer>
      <View className={classes.container}>
        <Label variant="title">This screen does not exist.</Label>
        <Label onPress={() => router.back()} className={classes.text}>
          Go back
        </Label>
      </View>
    </ScreenContainer>
  );
}

const classes = {
  text: 'text-teal-500',
  container: 'flex-1 justify-center items-center',
};
