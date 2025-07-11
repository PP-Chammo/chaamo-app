import { router } from 'expo-router';

import { Label, ScreenContainer } from '@/components/atoms';
import { Header } from '@/components/molecules';

export default function CardDetails() {
  return (
    <ScreenContainer>
      <Header title="Card Details" onBackPress={router.back} />
      <Label>Card Details Screen</Label>
    </ScreenContainer>
  );
}
