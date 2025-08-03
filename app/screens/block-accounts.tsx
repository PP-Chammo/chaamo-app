import React, { useCallback, useMemo, useState } from 'react';

import { router } from 'expo-router';
import { View } from 'react-native';

import { Icon, Label, ScreenContainer } from '@/components/atoms';
import { HeaderSearch } from '@/components/molecules';
import { BlockList } from '@/components/organisms';
import { BlockedUsers } from '@/domains/user.types';
import {
  useCreateBlockedUsersMutation,
  useGetBlockedAccountsQuery,
  useGetProfilesQuery,
} from '@/generated/graphql';
import { useUserVar } from '@/hooks/useUserVar';
import { getColor } from '@/utils/getColor';

export default function BlockedAccounts() {
  const [search, setSearch] = useState<string>('');
  const [user] = useUserVar();

  const { data: blockedData, refetch: refetchBlockedAccount } =
    useGetBlockedAccountsQuery({
      fetchPolicy: 'cache-and-network',
      variables: {
        filter: {
          blocked_user_id: {
            neq: user?.id,
          },
        },
      },
    });

  const blockedIds = useMemo(
    () =>
      blockedData?.blocked_usersCollection?.edges?.map(
        (item) => item?.node?.profiles?.id,
      ) ?? [],
    [blockedData?.blocked_usersCollection?.edges],
  );

  const { data, refetch: refetchProfiles } = useGetProfilesQuery({
    fetchPolicy: 'cache-and-network',
    variables: {
      filter: {
        not: {
          id: {
            in: [user?.id, ...blockedIds],
          },
        },
      },
    },
  });

  const listUsers = useMemo(() => {
    return data?.profilesCollection?.edges?.map((edge) => edge?.node) ?? [];
  }, [data]);

  const [addBlockedUsers, { loading: loadingBlock }] =
    useCreateBlockedUsersMutation();

  const handleBlock = useCallback(
    (userId: string) => {
      addBlockedUsers({
        variables: {
          objects: [
            {
              blocker_user_id: user?.id,
              blocked_user_id: userId,
            },
          ],
        },
        onCompleted: ({ insertIntoblocked_usersCollection }) => {
          if (insertIntoblocked_usersCollection?.records?.length) {
            refetchBlockedAccount();
            refetchProfiles();
          }
        },
      });
    },
    [addBlockedUsers, refetchBlockedAccount, refetchProfiles, user?.id],
  );

  const filteredBlockedAccounts = useMemo(() => {
    return listUsers.filter((user) =>
      user.username.toLowerCase().includes(search.toLowerCase()),
    );
  }, [listUsers, search]);

  const renderBlockedAccounts = useMemo(() => {
    if (filteredBlockedAccounts.length)
      return (
        <BlockList
          onBlock={handleBlock}
          data={filteredBlockedAccounts as BlockedUsers}
          isLoading={loadingBlock}
        />
      );

    return (
      <View className={classes.emptyContainer}>
        <Icon
          variant="Ionicons"
          name="ban-outline"
          size={80}
          color={getColor('primary-100')}
        />
        <Label className={classes.emptyText}>No accounts found</Label>
      </View>
    );
  }, [filteredBlockedAccounts, handleBlock, loadingBlock]);

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
