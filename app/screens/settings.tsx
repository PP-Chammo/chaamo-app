import { router } from 'expo-router';
import { ScrollView, View } from 'react-native';

import { Divider, Label, ScreenContainer } from '@/components/atoms';
import { Header, SettingItem } from '@/components/molecules';
import { getColor } from '@/utils/getColor';

export default function SettingsScreen() {
  return (
    <ScreenContainer classNameTop={classes.containerTop}>
      <Header
        title="Settings"
        onBackPress={() => router.back()}
        className={classes.header}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName={classes.contentContainer}
      >
        <View className={classes.sectionContainer}>
          <Label variant="subtitle" className={classes.sectionHeader}>
            Your account
          </Label>
          <SettingItem
            iconName="account-circle-outline"
            title="Account Center"
            subtitle="Password, security, personal details"
            onPress={() => {}}
          />
        </View>

        <View className={classes.sectionContainer}>
          <Label variant="subtitle" className={classes.sectionHeader}>
            Your preferences
          </Label>
          <SettingItem
            iconName="currency-usd"
            title="Currency"
            value="USD"
            onPress={() => {}}
          />
          <Divider position="horizontal" className={classes.divider} />
          <SettingItem
            iconName="block-helper"
            title="Block"
            value="0"
            onPress={() => router.push('/screens/blocked-accounts')}
          />
          <Divider position="horizontal" className={classes.divider} />
          <SettingItem
            iconName="bell-outline"
            title="Personalize Notifications"
            value="0"
            onPress={() => router.push('/screens/personalize-notification')}
          />
        </View>

        <View className={classes.sectionContainer}>
          <Label variant="subtitle" className={classes.sectionHeader}>
            Your payments and Subscription
          </Label>
          <SettingItem
            iconName="credit-card-outline"
            title="Payment & Subscription"
            onPress={() => {}}
          />
          <Divider position="horizontal" className={classes.divider} />
          <SettingItem
            iconName="clipboard-list-outline"
            title="My Orders"
            onPress={() => {}}
          />
        </View>

        <View className={classes.sectionContainer}>
          <Label variant="subtitle" className={classes.sectionHeader}>
            More info
          </Label>
          <SettingItem
            iconName="file-export-outline"
            title="Export Data"
            onPress={() => {}}
          />
          <Divider position="horizontal" className={classes.divider} />
          <SettingItem
            iconName="phone-outline"
            title="Contact Us"
            onPress={() => {}}
          />
          <Divider position="horizontal" className={classes.divider} />
          <SettingItem
            iconName="shield-lock-outline"
            title="Privacy Policy"
            onPress={() => {}}
          />
        </View>

        <View className={classes.sectionContainer}>
          <SettingItem
            iconName="delete-outline"
            iconColor={getColor('red-500')}
            title="Delete my account"
            onPress={() => {}}
          />
          <SettingItem
            iconName="logout"
            iconColor={getColor('teal-500')}
            title="Log out"
          />
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const classes = {
  containerTop: 'bg-white',
  contentContainer: 'my-4 gap-2.5',
  header: 'bg-white',
  sectionContainer: 'bg-white',
  sectionHeader: 'px-4 pt-3 text-xs text-slate-600 !font-light',
  deleteButton: 'mt-8 mx-4',
  logoutButton: 'mt-2 mx-4 mb-8',
  divider: 'bg-gray-100',
};
