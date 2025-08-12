import React, { useCallback, useMemo, useState } from 'react';

import { router, useFocusEffect } from 'expo-router';
import { View } from 'react-native';

import { ScreenContainer } from '@/components/atoms';
import { EmptyState, HeaderSearch } from '@/components/molecules';
import { BlockList } from '@/components/organisms';
import { useGetProfilesLazyQuery } from '@/generated/graphql';
import { useBlockedUsers } from '@/hooks/useBlockedUsers';
import useDebounce from '@/hooks/useDebounce';
import { useUserVar } from '@/hooks/useUserVar';
import { structuredClone } from '@/utils/structuredClone';

export default function BlockAccounts() {
  const [user] = useUserVar();
  const { blockedUsers, getIsBlocked } = useBlockedUsers();

  const [search, setSearch] = useState('');
  const debouncedSearchQuery = useDebounce(search, 500);

  // NOTE: this state is used to prevent the query from being called multiple times
  const [blockedList] = useState(
    structuredClone(blockedUsers.map((user) => user.node.blocked_user_id)),
  );

  const [getUsers, { data, loading }] = useGetProfilesLazyQuery({
    fetchPolicy: 'cache-and-network',
  });

  const unblockedList = useMemo(() => {
    return (
      data?.profilesCollection?.edges?.filter(
        (profile) => !getIsBlocked(profile.node.id),
      ) ?? []
    );
  }, [data?.profilesCollection?.edges, getIsBlocked]);

  useFocusEffect(
    useCallback(() => {
      if (user?.id) {
        getUsers({
          variables: {
            filter: {
              and: [
                {
                  not: {
                    id: {
                      in: [user?.id, ...blockedList],
                    },
                  },
                },
                {
                  username: debouncedSearchQuery
                    ? { ilike: `%${debouncedSearchQuery}%` }
                    : undefined,
                },
              ],
            },
            last: 50,
          },
        });
      }
    }, [getUsers, user?.id, debouncedSearchQuery, blockedList]),
  );

  return (
    <ScreenContainer classNameTop={classes.containerTop}>
      <HeaderSearch
        value={search}
        onChange={({ value }) => setSearch(value)}
        onBackPress={() => router.back()}
      />
      <View className={classes.container}>
        {unblockedList.length > 0 || loading ? (
          <BlockList list={unblockedList} loading={loading} />
        ) : (
          <EmptyState
            iconName="user"
            iconVariant="SimpleLineIcons"
            message="No accounts found"
          />
        )}
      </View>
    </ScreenContainer>
  );
}

const classes = {
  containerTop: 'bg-white',
  container: 'flex-1 px-4.5 mt-5',
};
