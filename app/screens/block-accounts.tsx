import React, { useMemo, useState } from 'react';

import { router } from 'expo-router';
import { View } from 'react-native';

import { Icon, Label, ScreenContainer } from '@/components/atoms';
import { HeaderSearch } from '@/components/molecules';
import { BlockList } from '@/components/organisms';
import { dummyBlockedAccounts } from '@/constants/dummy';
import { getColor } from '@/utils/getColor';

export default function BlockedAccounts() {
  const [search, setSearch] = useState<string>('');

  const filteredBlockedAccounts = useMemo(() => {
    return dummyBlockedAccounts.filter((account) =>
      account.name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [search]);

  const renderBlockedAccounts = useMemo(() => {
    if (filteredBlockedAccounts.length)
      return <BlockList data={filteredBlockedAccounts} />;

    return (
      <View className={classes.emptyContainer}>
        <Icon
          variant="Ionicons"
          name="ban-outline"
          size={80}
          color={getColor('teal-100')}
        />
        <Label className={classes.emptyText}>No accounts found</Label>
      </View>
    );
  }, [filteredBlockedAccounts]);

  return (
    <ScreenContainer>
      <HeaderSearch
        value={search}
        onChange={({ value }) => setSearch(value)}
        onBackPress={() => router.back()}
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
