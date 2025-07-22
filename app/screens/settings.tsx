import { Fragment, useCallback, useState } from 'react';

import { router } from 'expo-router';
import { ScrollView, View } from 'react-native';

import {
  Button,
  Divider,
  Label,
  Modal,
  ScreenContainer,
} from '@/components/atoms';
import { Header, SettingItem } from '@/components/molecules';
import { getColor } from '@/utils/getColor';

export default function SettingsScreen() {
  const [isDeleteAccountModalVisible, setIsDeleteAccountModalVisible] =
    useState<boolean>(false);

  const handleDeleteAccount = useCallback(() => {
    setIsDeleteAccountModalVisible(!isDeleteAccountModalVisible);
  }, [isDeleteAccountModalVisible]);

  return (
    <Fragment>
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
              onPress={() => router.push('/screens/account-center')}
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
              onPress={() => router.push('/screens/change-currency')}
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
              onPress={() => router.push('/screens/plans')}
            />
            <Divider position="horizontal" className={classes.divider} />
            <SettingItem
              iconName="clipboard-list-outline"
              title="My Orders"
              onPress={() => router.push('/screens/orders')}
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
              title="Privacy Policies"
              onPress={() => router.push('/screens/privacy-policies')}
            />
          </View>

          <View className={classes.sectionContainer}>
            <SettingItem
              iconName="delete-outline"
              iconColor={getColor('red-500')}
              title="Delete my account"
              onPress={handleDeleteAccount}
            />
            <SettingItem
              iconName="logout"
              iconColor={getColor('primary-500')}
              title="Log out"
            />
          </View>
        </ScrollView>
      </ScreenContainer>

      {/* Delete Account Modal */}
      <Modal
        visible={isDeleteAccountModalVisible}
        onClose={handleDeleteAccount}
        className={classes.deleteAccountModal}
      >
        <Label className={classes.deleteAccountModalTitle}>
          Delete Account
        </Label>
        <Label className={classes.deleteAccountModalDescription}>
          Are you sure you want to delete your account. It will be deleted
          permanently and can not be resorted.
        </Label>
        <Divider position="horizontal" />
        <Button
          variant="ghost"
          className={classes.deleteAccountModalButton}
          textClassName={classes.deleteAccountModalButtonText}
        >
          Delete
        </Button>
        <Divider position="horizontal" />
        <Button variant="ghost" onPress={handleDeleteAccount}>
          Cancel
        </Button>
      </Modal>
    </Fragment>
  );
}

const classes = {
  containerTop: 'bg-white',
  contentContainer: 'my-4 gap-2.5',
  header: 'bg-white',
  sectionContainer: 'bg-white',
  sectionHeader: 'px-4 pt-3 text-xs text-slate-600 !font-light',
  divider: '!bg-slate-100',
  deleteAccountModal: 'mx-14 items-center pt-5',
  deleteAccountModalTitle: 'text-lg font-bold text-slate-900',
  deleteAccountModalDescription:
    'text-md text-slate-600 text-center mx-16 mt-4 mb-8',
  deleteAccountModalButton: 'text-red-500',
  deleteAccountModalButtonText: 'text-red-700',
};
