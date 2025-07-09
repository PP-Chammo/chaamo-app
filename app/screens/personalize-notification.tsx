import { router } from 'expo-router';
import { ScrollView } from 'react-native';

import { ScreenContainer } from '@/components/atoms';
import { Header, SwitchInput } from '@/components/molecules';

export default function SettingsScreen() {
  return (
    <ScreenContainer classNameTop={classes.containerTop}>
      <Header
        title="Personalize Notification"
        onBackPress={() => router.back()}
        className={classes.header}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName={classes.contentContainer}
      >
        <SwitchInput
          label="Live price updates"
          value={true}
          onValueChange={() => {}}
        />
        <SwitchInput label="Messages" value={false} onValueChange={() => {}} />
        <SwitchInput label="New Bids" value={false} onValueChange={() => {}} />
        <SwitchInput
          label="Sold items"
          value={false}
          onValueChange={() => {}}
        />
        <SwitchInput label="Out Bid" value={true} onValueChange={() => {}} />
        <SwitchInput
          label="Offer accepted"
          value={false}
          onValueChange={() => {}}
        />
        <SwitchInput
          label="Offer declined"
          value={false}
          onValueChange={() => {}}
        />
      </ScrollView>
    </ScreenContainer>
  );
}

const classes = {
  containerTop: 'bg-white',
  contentContainer: 'my-4 gap-2.5',
  header: 'bg-white',
};
