import { useCallback, useMemo } from 'react';

import * as Linking from 'expo-linking';
import { router, useFocusEffect } from 'expo-router';
import { Alert, View } from 'react-native';

import {
  BillingInfo,
  Button,
  PaymentMethodCard,
  ScreenContainer,
} from '@/components/atoms';
import { Header } from '@/components/molecules';
import {
  SubscriptionStatus,
  useGetSubscriptionDetailLazyQuery,
} from '@/generated/graphql';
import { useCurrencyDisplay } from '@/hooks/useCurrencyDisplay';
import { useUserVar } from '@/hooks/useUserVar';
import { handlePaypalPayment } from '@/utils/paypal';

export default function SubscriptionDetailsScreen() {
  const [user] = useUserVar();
  const { formatDisplay } = useCurrencyDisplay();

  const [getSubscriptionDetail, { data }] = useGetSubscriptionDetailLazyQuery({
    fetchPolicy: 'cache-and-network',
  });

  const detail = useMemo(() => {
    return data?.subscriptionsCollection?.edges?.[0]?.node;
  }, [data]);

  const gatewayAccountInfo = useMemo(() => {
    return JSON.parse(detail?.payments?.gateway_account_info ?? '{}');
  }, [detail]);

  const fnCancelSubscription = useCallback(async () => {
    try {
      const redirect = Linking.createURL('screens/settings');
      const planId = detail?.plan_id;
      const subscriptionId = detail?.paypal_subscription_id;
      const params = `redirect=${redirect}&user_id=${user?.id}&plan_id=${planId}&paypal_subscription_id=${subscriptionId}`;
      handlePaypalPayment({
        url: `${process.env.EXPO_PUBLIC_BACKEND_URL}/paypal/subscription/cancel?${params}`,
        redirectUrl: redirect,
        onSuccess: () => {
          Alert.alert('Success', 'Your subscription has been cancelled.');
        },
      });
    } catch (e) {
      console.error('Subscription error', e);
      Alert.alert('Payment error', 'Unable to cancel your subscription.');
    }
  }, [detail?.paypal_subscription_id, detail?.plan_id, user?.id]);

  const handleCancelSubscription = useCallback(() => {
    Alert.alert(
      'Cancel Subscription',
      'Are you sure you want to cancel your subscription?',
      [{ text: 'Cancel' }, { text: 'OK', onPress: fnCancelSubscription }],
    );
  }, [fnCancelSubscription]);

  useFocusEffect(
    useCallback(() => {
      getSubscriptionDetail({
        variables: {
          filter: {
            user_id: { eq: user?.id },
            status: { eq: SubscriptionStatus.ACTIVE },
          },
        },
      });
    }, [getSubscriptionDetail, user?.id]),
  );

  return (
    <ScreenContainer>
      <Header title="Payment and Subscription" onBackPress={router.back} />
      <View className={classes.container}>
        <PaymentMethodCard
          name={gatewayAccountInfo?.paypal_email ? 'paypal' : 'credit-card'}
          subscriptionInfo={{
            email: gatewayAccountInfo?.paypal_email,
            last4: gatewayAccountInfo?.credit_card_last4,
            expiry: gatewayAccountInfo?.credit_card_expiry,
          }}
          nextBillingDate={detail?.end_date}
        />
        <BillingInfo
          name={detail?.membership_plans?.name ?? ''}
          isPending={detail?.status === SubscriptionStatus.PENDING}
          subscriptionInfo={`${formatDisplay(
            detail?.membership_plans?.currency,
            detail?.membership_plans?.price ?? 0,
          )} / month`}
        />
      </View>
      <View className={classes.footer}>
        <Button
          onPress={handleCancelSubscription}
          disabled={detail?.status === SubscriptionStatus.PENDING}
        >
          Cancel Subscription
        </Button>
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
