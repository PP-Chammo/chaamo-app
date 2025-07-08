import { ScreenContainer } from '@/components/atoms';
import { Header, TabView } from '@/components/molecules';
import { inboxTabs } from '@/constants/tabs';

import AllInboxScreen from './all';
import BuyingInboxScreen from './buying';
import MyBidsInboxScreen from './my-bids';

export default function InboxLayout() {
  return (
    <ScreenContainer>
      <Header title="Inbox" />
      <TabView tabs={inboxTabs}>
        <AllInboxScreen />
        <BuyingInboxScreen />
        <MyBidsInboxScreen />
      </TabView>
    </ScreenContainer>
  );
}
