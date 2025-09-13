import { useCallback, useMemo } from 'react';

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

export default function SubscriptionDetailsScreen() {
  const [user] = useUserVar();
  const { formatDisplay } = useCurrencyDisplay();

  const [getSubscriptionDetail, { data }] = useGetSubscriptionDetailLazyQuery({
    fetchPolicy: 'cache-and-network',
  });

  const detail = useMemo(() => {
    return data?.subscriptionsCollection?.edges?.[0]?.node;
  }, [data]);

  const handleCancelSubscription = useCallback(() => {
    Alert.alert(
      'Cancel Subscription',
      'Are you sure you want to cancel your subscription?',
      [
        { text: 'Cancel' },
        { text: 'OK', onPress: () => Alert.alert('Coming soon') },
      ],
    );
  }, []);

  useFocusEffect(
    useCallback(() => {
      getSubscriptionDetail({
        variables: { filter: { user_id: { eq: user?.id } } },
      });
    }, [getSubscriptionDetail, user?.id]),
  );

  return (
    <ScreenContainer>
      <Header title="Payment and Subscription" onBackPress={router.back} />
      <View className={classes.container}>
        <PaymentMethodCard
          name="Visa"
          subscriptionInfo={{
            last4: '4242',
            expiry: '12/25',
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
