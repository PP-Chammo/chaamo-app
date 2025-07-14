import { router } from 'expo-router';
import { View } from 'react-native';

import { ScreenContainer, SubscriptionCard } from '@/components/atoms';
import { Header } from '@/components/molecules';

export default function SubscriptionsScreen() {
  return (
    <ScreenContainer>
      <Header title="Payment and Subscription" onBackPress={router.back} />
      <View className={classes.container}>
        <SubscriptionCard />
      </View>
    </ScreenContainer>
  );
}

const classes = {
  container: 'p-4.5',
};
