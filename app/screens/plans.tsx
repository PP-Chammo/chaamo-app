import { useCallback, useMemo } from 'react';

import * as Linking from 'expo-linking';
import { router } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { Alert, FlatList, View } from 'react-native';

import { Button, ScreenContainer } from '@/components/atoms';
import { Header, PlanCard } from '@/components/molecules';
import {
  MembershipType,
  useGetMembershipPlansQuery,
} from '@/generated/graphql';
import { useCurrencyDisplay } from '@/hooks/useCurrencyDisplay';

export default function PlansScreen() {
  const { formatDisplay } = useCurrencyDisplay();

  const { data } = useGetMembershipPlansQuery({
    fetchPolicy: 'cache-and-network',
  });

  const membershipPlans = useMemo(
    () => data?.membership_plansCollection?.edges ?? [],
    [data],
  );

  const handlePayWithPaypal = useCallback(async () => {
    const baseUrl = `${process.env.EXPO_PUBLIC_BACKEND_URL}/paypal/checkout`;
    if (!baseUrl) {
      Alert.alert('Missing configuration', 'PayPal needs checkout endpoint.');
      return;
    }

    // Build an app-specific redirect URL (must be whitelisted by your backend with PayPal)
    const redirectUrl = Linking.createURL('paypal-return');
    const amount = '9.99';
    const currency = 'USD';
    const startUrl = `${baseUrl}${baseUrl.includes('?') ? '&' : '?'}amount=${encodeURIComponent(
      amount,
    )}&currency=${encodeURIComponent(currency)}&redirect=${encodeURIComponent(redirectUrl)}`;

    try {
      const result = await WebBrowser.openAuthSessionAsync(
        startUrl,
        redirectUrl,
      );

      if (result.type === 'success' && result.url) {
        const { queryParams } = Linking.parse(result.url);
        const status = String(queryParams?.status ?? '');

        if (status === 'success') {
          router.push('/screens/checkout-subscription');
          return;
        }

        if (status === 'cancel') {
          Alert.alert(
            'Payment cancelled',
            'You cancelled the PayPal checkout.',
          );
          return;
        }

        Alert.alert(
          'Payment error',
          'PayPal checkout failed. Please try again.',
        );
        return;
      }

      if (result.type === 'cancel') {
        Alert.alert('Payment cancelled', 'You cancelled the PayPal checkout.');
        return;
      }

      Alert.alert('Payment error', 'Unable to complete PayPal checkout.');
    } catch (e) {
      console.error('PayPal checkout error', e);
      Alert.alert('Payment error', 'Unable to start PayPal checkout.');
    }
  }, []);

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
