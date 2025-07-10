import React, { useMemo } from 'react';

import { router } from 'expo-router';
import { View } from 'react-native';

import { Icon, Label, ScreenContainer } from '@/components/atoms';
import { Header } from '@/components/molecules';
import { BlockList } from '@/components/organisms';
import { dummyBlockedAccounts } from '@/constants/dummy';
import { getColor } from '@/utils/getColor';

export default function BlockedAccounts() {
  const renderBlockedAccounts = useMemo(() => {
    if (dummyBlockedAccounts.length)
      return <BlockList isBlocked data={dummyBlockedAccounts} />;

    return (
      <View className={classes.emptyContainer}>
        <Icon
          variant="Ionicons"
          name="ban-outline"
          size={80}
          color={getColor('teal-100')}
        />
        <Label className={classes.emptyText}>No blocked accounts found</Label>
      </View>
    );
  }, []);

  return (
    <ScreenContainer>
      <Header
        title="Blocked Accounts"
        onBackPress={() => router.back()}
        iconRight="plus-circle"
        iconRightColor={getColor('teal-600')}
        iconRightSize={28}
        onRightPress={() => router.push('/screens/block-accounts')}
      />
      <View className={classes.container}>{renderBlockedAccounts}</View>
    </ScreenContainer>
  );
}

const classes = {
  emptyContainer: 'flex-1 items-center gap-8 mt-16',
  emptyText: 'text-center text-slate-600',
  container: 'flex-1 px-4.5 mt-5',
};
