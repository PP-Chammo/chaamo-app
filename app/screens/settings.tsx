import { Fragment, useCallback, useMemo, useState } from 'react';

import { router, useFocusEffect } from 'expo-router';
import { Alert, ScrollView, View } from 'react-native';

import {
  Button,
  Divider,
  Label,
  Modal,
  ScreenContainer,
} from '@/components/atoms';
import { Header, SettingItem } from '@/components/molecules';
import { currencyMap } from '@/constants/currencies';
import {
  useGetNotificationsLazyQuery,
  useGetSubscriptionsLazyQuery,
  useGetUserNotificationSettingsQuery,
} from '@/generated/graphql';
import { useBlockedUsers } from '@/hooks/useBlockedUsers';
import { useUserVar } from '@/hooks/useUserVar';
import { deleteAccount, logout } from '@/utils/auth';
import { sendAccountDeletionEmail } from '@/utils/email';
import { exportUserData } from '@/utils/exportData';
import { getColor } from '@/utils/getColor';

export default function SettingsScreen() {
  const [user] = useUserVar();
  const { blockedUsers } = useBlockedUsers();

  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  const [isDeleteAccountModalVisible, setIsDeleteAccountModalVisible] =
    useState<boolean>(false);

  const [getSubscriptions, { data: subscriptionsData }] =
    useGetSubscriptionsLazyQuery({
      fetchPolicy: 'cache-and-network',
    });

  const {
    data: userNotificationSettingsData,
    refetch: refetchUserNotificationSettings,
  } = useGetUserNotificationSettingsQuery({
    fetchPolicy: 'cache-and-network',
    variables: {
      filter: {
        user_id: {
          eq: user.id,
        },
        is_enabled: {
          eq: true,
        },
      },
    },
  });

  const [getNotifications] = useGetNotificationsLazyQuery();

  const hasSubscription = useMemo(() => {
    return subscriptionsData?.subscriptionsCollection?.edges?.length ?? 0 > 0;
  }, [subscriptionsData?.subscriptionsCollection?.edges?.length]);

  const handleDeleteAccountModal = useCallback(() => {
    setIsDeleteAccountModalVisible(!isDeleteAccountModalVisible);
  }, [isDeleteAccountModalVisible]);

  const handleDeleteAccount = useCallback(async () => {
    try {
      setIsDeletingAccount(true);

      await deleteAccount(async () => {
        Alert.alert('Success', 'Account deleted successfully', [
          {
            text: 'OK',
            onPress: handleDeleteAccountModal,
          },
        ]);

        await sendAccountDeletionEmail(
          user?.email ?? '',
          user?.profile?.username,
        );
      });
    } catch {
      Alert.alert('Error', 'Failed to delete account');
      setIsDeletingAccount(false);
    } finally {
      setIsDeletingAccount(false);
    }
  }, [handleDeleteAccountModal, user?.email, user?.profile?.username]);

  const handleExportPress = useCallback(async () => {
    Alert.alert('Export Data', 'Are you sure you want to export your data?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Export',
        onPress: async () => {
          const { data } = await getNotifications({
            variables: {
              filter: {
                user_id: { eq: user.id },
              },
            },
          });

          const notifications =
            data?.notificationsCollection?.edges?.map(
              (notification) => notification?.node,
            ) ?? [];

          const notificationPreferences =
            userNotificationSettingsData?.user_notification_settingsCollection?.edges?.map(
              (setting) => setting?.node,
            ) ?? [];

          const activityData = {
            notifications,
          };

          const settings = {
            notificationPreferences,
          };

          exportUserData(user, activityData, settings);
        },
      },
    ]);
  }, [
    getNotifications,
    user,
    userNotificationSettingsData?.user_notification_settingsCollection?.edges,
  ]);

  const currencyLabel = useMemo(() => {
    return currencyMap?.[user?.profile?.currency ?? 'USD'];
  }, [user?.profile?.currency]);

  const countUserNotificationSettings = useMemo(
    () =>
      userNotificationSettingsData?.user_notification_settingsCollection?.edges?.length.toString() ??
      '0',
    [
      userNotificationSettingsData?.user_notification_settingsCollection?.edges
        ?.length,
    ],
  );

  const handleLogout = useCallback(() => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      {
        text: 'Cancel',
        onPress: () => {},
        style: 'cancel',
      },
      {
        text: 'Logout',
        onPress: logout,
      },
    ]);
  }, []);

  useFocusEffect(
    useCallback(() => {
      refetchUserNotificationSettings();
    }, [refetchUserNotificationSettings]),
  );

  useFocusEffect(
    useCallback(() => {
      getSubscriptions({
        variables: {
          filter: {
            user_id: {
              eq: user?.id,
            },
            end_date: {
              gt: new Date().toISOString(),
            },
          },
        },
      });
    }, [getSubscriptions, user?.id]),
  );

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
              value={currencyLabel}
              onPress={() => router.push('/screens/change-currency')}
            />
            <Divider position="horizontal" className={classes.divider} />
            <SettingItem
              iconName="block-helper"
              title="Block"
              value={String(blockedUsers.length)}
              onPress={() => router.push('/screens/blocked-accounts')}
            />
            <Divider position="horizontal" className={classes.divider} />
            <SettingItem
              iconName="bell-outline"
              title="Personalize Notifications"
              value={countUserNotificationSettings}
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
              onPress={() =>
                hasSubscription
                  ? router.push('/screens/subscription-details')
                  : router.push('/screens/plans')
              }
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
              onPress={handleExportPress}
            />
            <Divider position="horizontal" className={classes.divider} />
            <SettingItem
              iconName="phone-outline"
              title="Contact Us"
              onPress={() => router.push('/screens/contact-us')}
            />
            <Divider position="horizontal" className={classes.divider} />
            <SettingItem
              iconName="shield-lock-outline"
              title="Policies"
              onPress={() => router.push('/screens/privacy-policies')}
            />
          </View>

          <View className={classes.sectionContainerLast}>
            <SettingItem
              iconName="delete-outline"
              iconColor={getColor('red-500')}
              title="Delete my account"
              onPress={handleDeleteAccountModal}
            />
            <SettingItem
              iconName="logout"
              iconColor={getColor('primary-500')}
              title="Log out"
              onPress={handleLogout}
            />
          </View>
        </ScrollView>
      </ScreenContainer>

      {/* Delete Account Modal */}
      <Modal
        visible={isDeleteAccountModalVisible}
        onClose={handleDeleteAccountModal}
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
          onPress={handleDeleteAccount}
          disabled={isDeletingAccount}
          loading={isDeletingAccount}
        >
          Delete
        </Button>
        <Divider position="horizontal" />
        <Button variant="ghost" onPress={handleDeleteAccountModal}>
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
  sectionContainerLast: 'bg-white mb-20',
  sectionHeader: 'px-4 pt-3 text-xs text-slate-600 !font-light',
  divider: '!bg-slate-100',
  deleteAccountModal: 'mx-14 items-center pt-5',
  deleteAccountModalTitle: 'text-lg font-bold text-slate-900',
  deleteAccountModalDescription:
    'text-md text-slate-600 text-center mx-16 mt-4 mb-8',
  deleteAccountModalButton: 'text-red-500',
  deleteAccountModalButtonText: 'text-red-700',
};
