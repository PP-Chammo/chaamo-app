import { ScreenContainer } from '@/components/atoms';
import { Header, TabView } from '@/components/molecules';
import { inboxTabs } from '@/constants/tabs';

import AllInboxScreen from './all';
import BuyingInboxScreen from './buying';
import MyBidsInboxScreen from './my-bids';

export default function InboxLayout() {
  return (
    <ScreenContainer classNameTop={classes.containerTop}>
      <Header title="Inbox" className={classes.header} />
      <TabView tabs={inboxTabs} className={classes.tabView}>
        <AllInboxScreen />
        <BuyingInboxScreen />
        <MyBidsInboxScreen />
      </TabView>
    </ScreenContainer>
  );
}

const classes = {
  containerTop: 'bg-white',
  header: 'bg-white',
  tabView: 'bg-white',
};
