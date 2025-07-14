import { router } from 'expo-router';
import { View } from 'react-native';

import {
  BillingInfo,
  Button,
  Label,
  PaymentMethodCard,
  Row,
  ScreenContainer,
} from '@/components/atoms';
import { Header } from '@/components/molecules';

export default function SubscriptionDetailsScreen() {
  return (
    <ScreenContainer>
      <Header title="Payment and Subscription" onBackPress={router.back} />
      <View className={classes.container}>
        <PaymentMethodCard nextBilling />
        <BillingInfo />
      </View>
      <View className={classes.footer}>
        <Row between className={classes.row}>
          <Label>Monthly Billing Amount</Label>
          <Label className={classes.price}>$12.99</Label>
        </Row>
        <Button>Cancel Subscription</Button>
      </View>
    </ScreenContainer>
  );
}

const classes = {
  container: 'flex-1 p-4.5 gap-10',
  footer: 'mb-10 mx-4.5',
  price: 'text-md font-bold',
  row: 'mb-5',
};
