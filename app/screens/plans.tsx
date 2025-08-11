import { router } from 'expo-router';
import { Alert, FlatList, View } from 'react-native';

import { Button, ScreenContainer } from '@/components/atoms';
import { Header, PlanCard } from '@/components/molecules';
import { dummyPlans } from '@/constants/dummy';

export default function PlansScreen() {
  const handleBuySubscription = () => {
    Alert.alert('Coming soon', 'This feature is not available yet');
    // router.push('/screens/card-details');
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
          renderItem={({ item }) => <PlanCard {...item} />}
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
