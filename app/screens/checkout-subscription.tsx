import { router } from 'expo-router';

import { ScreenContainer } from '@/components/atoms';
import { Header } from '@/components/molecules';

export default function CheckoutSubscriptionScreen() {
  return (
    <ScreenContainer>
      <Header title="Checkout" onBackPress={router.back} />
    </ScreenContainer>
  );
}
