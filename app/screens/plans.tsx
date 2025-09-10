import { useCallback, useMemo } from 'react';

import { router } from 'expo-router';
import { Alert, FlatList, View } from 'react-native';

import { Button, ScreenContainer } from '@/components/atoms';
import { Header, PlanCard } from '@/components/molecules';
import {
  MembershipType,
  useGetMembershipPlansQuery,
} from '@/generated/graphql';
import { useCurrencyDisplay } from '@/hooks/useCurrencyDisplay';
import { useUserVar } from '@/hooks/useUserVar';
import {
  payPalSubscriptionCheckout,
  PayPalCheckoutResult,
  SubscriptionPlanParams,
} from '@/utils/paypal';

export default function PlansScreen() {
  const [user] = useUserVar();
  const { formatDisplay } = useCurrencyDisplay();

  const { data } = useGetMembershipPlansQuery({
    fetchPolicy: 'cache-and-network',
  });

  const membershipPlans = useMemo(
    () => data?.membership_plansCollection?.edges ?? [],
    [data],
  );

  const handlePayWithPaypal = useCallback(async () => {
    const selectedPlan = membershipPlans[0];

    const paypalPlanId = selectedPlan?.node?.paypal_plan_id;
    const membershipPlanId = selectedPlan?.node?.id;

    if (!paypalPlanId || !membershipPlanId) {
      return Alert.alert('No plan selected');
    }

    const subscriptionParams: SubscriptionPlanParams = {
      paypalPlanId,
      membershipPlanId,
      userId: user.id,
      subscriberEmail: user.email!,
      subscriberName: user?.profile?.username,
    };

    const result = await payPalSubscriptionCheckout(subscriptionParams, {
      onSuccess: (result: PayPalCheckoutResult) => {
        console.log('PayPal subscription successful: ', result);
        // router.push('/screens/checkout-subscription');
      },
      onError: (error: string) => {
        console.error('PayPal subscription error:', error);
      },
    });

    if (result.status === 'success') {
      console.log('PayPal subscription successful:', result.transactionId);
    }
  }, [membershipPlans, user.id, user.email, user?.profile?.username]);

  return (
    <ScreenContainer>
      <Header title="Premium Plan" onBackPress={router.back} />
      <View className={classes.container}>
        <FlatList
          data={membershipPlans}
          keyExtractor={(item) => item.node.id}
          contentContainerClassName={classes.contentContainer}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <PlanCard
              type={item.node.type ?? MembershipType.BASIC}
              name={item.node.name ?? ''}
              description={item.node.description ?? ''}
              subscriptionDays={item.node.subscription_days}
              priceDisplay={formatDisplay(item.node.currency, item.node.price)}
              benefits={JSON.parse(item.node.benefits)}
            />
          )}
        />
      </View>
      <Button className={classes.button} onPress={handlePayWithPaypal}>
        Buy Subscription
      </Button>
    </ScreenContainer>
  );
}

const classes = {
  container: 'flex-1 px-10',
  contentContainer: 'gap-10 pb-12',
  button: 'mb-10 mx-4.5',
};
