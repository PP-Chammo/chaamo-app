import React, { useMemo } from 'react';

import { router } from 'expo-router';
import { View } from 'react-native';

import { ScreenContainer } from '@/components/atoms';
import { EmptyState, Header } from '@/components/molecules';
import { BlockList } from '@/components/organisms';
import { GetProfilesQuery, useGetBlockedUsersQuery } from '@/generated/graphql';
import { useBlockedUsers } from '@/hooks/useBlockedUsers';
import { useUserVar } from '@/hooks/useUserVar';
import { DeepGet } from '@/types/helper';
import { getColor } from '@/utils/getColor';

export default function BlockedAccounts() {
  const [user] = useUserVar();
  const { getIsBlocked } = useBlockedUsers();

  const { data, loading } = useGetBlockedUsersQuery({
    fetchPolicy: 'cache-and-network',
    variables: {
      filter: {
        and: [
          {
            blocker_user_id: {
              eq: user?.id,
            },
          },
        ],
      },
    },
  });

  const blockedList = useMemo(() => {
    return (
      data?.blocked_usersCollection?.edges
        ?.filter(
          (edge) => edge.node.profiles && getIsBlocked(edge.node.profiles.id),
        )
        ?.map((edge) => ({
          node: edge.node.profiles,
        })) ?? []
    );
  }, [data?.blocked_usersCollection?.edges, getIsBlocked]);

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
      {blockedList.length > 0 || loading ? (
        <View className={classes.container}>
          <BlockList
            list={
              blockedList as DeepGet<
                GetProfilesQuery,
                ['profilesCollection', 'edges']
              >
            }
            loading={loading}
          />
        </View>
      ) : (
        <EmptyState
          iconName="ban-outline"
          iconVariant="Ionicons"
          iconColor={getColor('red-200')}
          message="No blocked accounts found"
        />
      )}
    </ScreenContainer>
  );
}

const classes = {
  container: 'flex-1 px-4.5 mt-5',
};
