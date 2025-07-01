import { router } from 'expo-router';

import { Label, ScreenContainer } from '@/components/atoms';

export default function NotFoundScreen() {
  return (
    <ScreenContainer>
      <Label variant="title">This screen does not exist.</Label>
      <Label onPress={() => router.back()} className={classes.text}>
        Go back
      </Label>
    </ScreenContainer>
  );
}

const classes = {
  text: 'text-teal-500',
};
