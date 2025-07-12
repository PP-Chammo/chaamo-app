import { router } from 'expo-router';
import { FlatList, View } from 'react-native';

import { Button, ScreenContainer } from '@/components/atoms';
import { Header, SubscriptionCard } from '@/components/molecules';
import { dummyPlans } from '@/constants/dummy';

export default function SubscriptionScreen() {
  const handleBuySubscription = () => {
    router.push('/screens/card-details');
  };

  return (
    <ScreenContainer>
      <Header title="Premium Plan" onBackPress={router.back} />
      <View className={classes.container}>
        <FlatList
          data={dummyPlans}
          keyExtractor={(item) => item.id.toString()}
          contentContainerClassName={classes.contentContainer}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => <SubscriptionCard {...item} />}
        />
      </View>
      <Button className={classes.button} onPress={handleBuySubscription}>
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
