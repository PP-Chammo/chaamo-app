import { Link, Stack } from 'expo-router';
import { View } from 'react-native';

import { Label } from '@/components/atoms';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View className={classes.container}>
        <Label variant="title">This screen does not exist.</Label>
        <Link href="/sign-in">
          <Label>Go back</Label>
        </Link>
      </View>
    </>
  );
}

const classes = {
  container: 'flex-1 items-center justify-center p-5',
};
