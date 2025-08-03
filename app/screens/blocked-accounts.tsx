import React, { useCallback, useMemo } from 'react';

import { router } from 'expo-router';
import { View } from 'react-native';

import { Icon, Label, ScreenContainer } from '@/components/atoms';
import { Header } from '@/components/molecules';
import { BlockList } from '@/components/organisms';
import { BlockedUsers } from '@/domains/user.types';
import {
  GetBlockedAccountsQuery,
  useGetBlockedAccountsQuery,
  useRemoveBlockedUsersMutation,
} from '@/generated/graphql';
import { DeepGet } from '@/types/helper';
import { cache } from '@/utils/apollo';
import { getColor } from '@/utils/getColor';

export default function BlockedAccounts() {
  const { data, loading } = useGetBlockedAccountsQuery({
    fetchPolicy: 'cache-and-network',
  });
  const [removeBlockedUsers, { loading: loadingRemove }] =
    useRemoveBlockedUsersMutation();

  const blockedAccounts = useMemo(() => {
    return (
      data?.blocked_usersCollection?.edges?.map(
        (edge) => edge?.node?.profiles,
      ) ?? []
    );
  }, [data]);

  const handleRemove = useCallback(
    (id: string) => {
      removeBlockedUsers({
        variables: { filter: { blocked_user_id: { eq: id } } },
        onCompleted: ({ deleteFromblocked_usersCollection }) => {
          if (deleteFromblocked_usersCollection?.records?.length) {
            cache.modify({
              fields: {
                blocked_usersCollection(existing) {
                  return existing.edges.filter(
                    (
                      item: DeepGet<
                        GetBlockedAccountsQuery,
                        ['blocked_usersCollection', 'edges', 0]
                      >,
                    ) => item.node.profiles?.id !== id,
                  );
                },
              },
            });
          }
        },
      });
    },
    [removeBlockedUsers],
  );

  const renderBlockedAccounts = useMemo(() => {
    if (blockedAccounts.length && !loading)
      return (
        <BlockList
          isBlocked
          onRemove={handleRemove}
          isLoading={loadingRemove}
          data={blockedAccounts as BlockedUsers}
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
        <Label className={classes.emptyText}>No blocked accounts found</Label>
      </View>
    );
  }, [blockedAccounts, handleRemove, loading, loadingRemove]);

  return (
    <ScreenContainer>
      <Header
        title="Blocked Accounts"
        onBackPress={() => router.back()}
        rightIcon="plus-circle"
        rightIconColor={getColor('primary-500')}
        rightIconSize={28}
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
