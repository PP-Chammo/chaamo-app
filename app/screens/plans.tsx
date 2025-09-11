import { useCallback, useMemo } from 'react';

import * as Linking from 'expo-linking';
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
import { handlePaypalPayment } from '@/utils/paypal';

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

  const firstPlan = useMemo(
    () => membershipPlans?.[0]?.node,
    [membershipPlans],
  );

  const handlePayWithPaypal = useCallback(async () => {
    const baseUrl = `${process.env.EXPO_PUBLIC_BACKEND_URL}/paypal/subscription`;
    const redirectUrl = Linking.createURL('screens/plans');
    const startUrl = `${baseUrl}${baseUrl.includes('?') ? '&' : '?'}user_id=${encodeURIComponent(user?.id)}&plan_id=${encodeURIComponent(firstPlan?.id)}&redirect=${encodeURIComponent(redirectUrl)}`;

    try {
      handlePaypalPayment({
        url: startUrl,
        redirectUrl,
        onSuccess: () => {
          router.replace('/screens/checkout-success');
        },
      });
    } catch (e) {
      console.error('Subscription error', e);
      Alert.alert('Payment error', 'Unable to call chaamo subscription.');
    }
  }, [firstPlan?.id, user?.id]);

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
      <Button
        className={classes.button}
        onPress={handlePayWithPaypal}
        disabled={membershipPlans.length === 0}
      >
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
