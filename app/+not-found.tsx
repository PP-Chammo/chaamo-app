import { Link } from 'expo-router';

import { Label, ScreenContainer } from '@/components/atoms';

export default function NotFoundScreen() {
  return (
    <ScreenContainer>
      <Label variant="title">This screen does not exist.</Label>
      <Link href="/sign-in">
        <Label>Go back</Label>
      </Link>
    </ScreenContainer>
  );
}
