import { router } from 'expo-router';

import { ScreenContainer } from '@/components/atoms';
import { Header, TabView } from '@/components/molecules';
import { BoughtOrder, SoldOrder } from '@/components/organisms';
import { ORDER_TABS } from '@/constants/tabs';

export default function Orders() {
  return (
    <ScreenContainer>
      <Header title="My Orders" onBackPress={router.back} />
      <TabView tabs={ORDER_TABS}>
        <SoldOrder />
        <BoughtOrder />
      </TabView>
    </ScreenContainer>
  );
}
