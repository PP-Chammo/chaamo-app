import { Link, router } from 'expo-router';
import { View } from 'react-native';

import {
  BillingInfo,
  Button,
  Label,
  PaymentMethodCard,
  ScreenContainer,
} from '@/components/atoms';
import { Header } from '@/components/molecules';

export default function CheckoutSubscriptionScreen() {
  return (
    <ScreenContainer>
      <Header title="Checkout" onBackPress={router.back} />

      <View className={classes.container}>
        <PaymentMethodCard className={classes.paymentMethod} />
        <BillingInfo />
      </View>
      <View className={classes.footer}>
        <Label className={classes.terms}>
          Please checkout CHAAMO{' '}
          <Link
            className={classes.link}
            href="https://chaamo.com/terms-of-service"
          >
            Terms & Condition
          </Link>
        </Label>
        <Label> </Label>
        <Button>Buy Subscription</Button>
      </View>
    </ScreenContainer>
  );
}

const classes = {
  container: 'flex-1 p-4.5 gap-10',
  label: 'text-sm font-bold text-gray-800',
  paymentMethod: 'mb-12',
  billingContainer: 'gap-3',
  billingRow: 'border-[0.2px] border-yellow-400 p-2',
  price: 'text-sm font-bold',
  footer: 'mb-12 mx-4.5',
  terms: 'text-sm text-gray-500 text-center',
  link: 'underline font-bold',
};
