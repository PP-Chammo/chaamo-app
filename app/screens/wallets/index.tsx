import React from 'react';

import { router } from 'expo-router';
import { View } from 'react-native';

import {
  BankAccount,
  Button,
  Divider,
  Icon,
  Label,
  ScreenContainer,
} from '@/components/atoms';
import { Header } from '@/components/molecules';
import { getColor } from '@/utils/getColor';

export default function WalletScreen() {
  return (
    <ScreenContainer>
      <Header title="Wallet" onBackPress={() => router.back()} />
      <View className={classes.container}>
        <View className={classes.balanceContainer}>
          <Label className={classes.availableBalanceText}>
            Available Balance
          </Label>
          <Label variant="title">$2000</Label>
          <Button className={classes.withdrawButton}>
            Withdraw to back account
          </Button>
          <Divider position="horizontal" className={classes.divider} />
          <View className={classes.statusContainer}>
            <Label className={classes.statusTitle}>Pending</Label>
            <View className={classes.statusAmountContainer}>
              <Label className={classes.statusAmount}>$500</Label>
              <Icon
                name="information-outline"
                size={24}
                color={getColor('slate-400')}
              />
            </View>
          </View>
        </View>

        <View className={classes.withdrawContainer}>
          <Label className={classes.withdrawTitle}>Withdraw Methods</Label>
          <Button
            variant="primary-light"
            className={classes.addMethodButton}
            onPress={() => router.push('/screens/wallets/add-bank-account')}
          >
            Add a method
          </Button>
          <View className={classes.bankAccountsContainer}>
            <BankAccount cardNumber="6754" onPress={() => {}} />
          </View>
        </View>
      </View>
    </ScreenContainer>
  );
}

const classes = {
  container: 'flex-1 p-6',
  balanceContainer: 'bg-teal-200/20 rounded-lg px-4 py-6',
  availableBalanceText: 'text-slate-600',
  withdrawButton: 'mt-8',
  divider: 'mt-8',
  statusContainer: 'flex-row items-center justify-between mt-3',
  statusTitle: 'text-slate-600',
  statusAmountContainer: 'flex-row items-center gap-2',
  statusAmount: 'text-slate-600',
  withdrawContainer:
    'bg-white rounded-lg px-4 py-6 mt-8 shadow border border-slate-100',
  withdrawTitle: 'text-slate-600 text-lg',
  addMethodButton: 'mt-4 bg-transparent',
  withdrawAmountContainer: 'flex-row items-center gap-2',
  withdrawAmount: 'text-slate-600 text-2xl font-bold',
  bankAccountsContainer: 'mt-8',
};
