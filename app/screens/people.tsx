import { useCallback, useMemo, useState } from 'react';

import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import { FlatList } from 'react-native';

import { Loading, ScreenContainer } from '@/components/atoms';
import { HeaderSearch, People } from '@/components/molecules';
import { TextChangeParams } from '@/domains';
import {
  useCreateFollowsMutation,
  useGetVwPeoplesLazyQuery,
  useRemoveFollowsMutation,
} from '@/generated/graphql';
import useDebounce from '@/hooks/useDebounce';
import { useFollows } from '@/hooks/useFollows';
import { useUserVar } from '@/hooks/useUserVar';

export default function PeopleScreen() {
  const [user] = useUserVar();
  const { getIsFollowing } = useFollows();
  const [search, setSearch] = useState('');
  const debouncedSearchQuery = useDebounce(search, 500);

  const [processedList, setProcessedList] = useState<string[]>([]);

  const [getPeoples, { data, loading }] = useGetVwPeoplesLazyQuery({
    fetchPolicy: 'cache-and-network',
    variables: {
      filter: {
        username: debouncedSearchQuery
          ? { ilike: `%${debouncedSearchQuery}%` }
          : undefined,
      },
      last: 50,
    },
  });
  const [createFollowing, { loading: createFollowingLoading }] =
    useCreateFollowsMutation();
  const [removeFollowing, { loading: removeFollowingLoading }] =
    useRemoveFollowsMutation();

  const peoples = useMemo(
    () => data?.vw_peoplesCollection?.edges ?? [],
    [data?.vw_peoplesCollection?.edges],
  );

  const handleSearchChange = useCallback(({ value }: TextChangeParams) => {
    setSearch(value);
  }, []);

  const handleToggleFollow = useCallback(
    (followeeUserId: string) => () => {
      setProcessedList((prev) => [...prev, followeeUserId]);
      if (getIsFollowing(followeeUserId)) {
        removeFollowing({
          variables: {
            filter: {
              follower_user_id: { eq: user?.id },
              followee_user_id: { eq: followeeUserId },
            },
          },
          onCompleted: () => {
            setProcessedList((prev) =>
              prev.filter((id) => id !== followeeUserId),
            );
          },
        });
      } else {
        createFollowing({
          variables: {
            objects: [
              {
                follower_user_id: user?.id,
                followee_user_id: followeeUserId,
              },
            ],
          },
          onCompleted: () => {
            setProcessedList((prev) =>
              prev.filter((id) => id !== followeeUserId),
            );
          },
        });
      }
    },
    [createFollowing, getIsFollowing, removeFollowing, user?.id],
  );

  useFocusEffect(
    useCallback(() => {
      if (user?.id) {
        getPeoples();
      }
    }, [getPeoples, user?.id]),
  );

  // Refetch when search query changes
  useFocusEffect(
    useCallback(() => {
      if (user?.id) {
        getPeoples({
          variables: {
            filter: {
              username: debouncedSearchQuery
                ? { ilike: `%${debouncedSearchQuery}%` }
                : undefined,
            },
          },
        });
      }
    }, [getPeoples, user?.id, debouncedSearchQuery]),
  );

  return (
    <ScreenContainer>
      <HeaderSearch
        value={search}
        onChange={handleSearchChange}
        onBackPress={() => router.back()}
      />
      {loading ? (
        <Loading />
      ) : (
        <FlatList
          data={peoples}
          keyExtractor={(item) => item.node.id}
          showsVerticalScrollIndicator={false}
          contentContainerClassName={classes.contentContainer}
          renderItem={({ item: people }) => (
            <People
              key={people.node.id}
              size="md"
              followed={getIsFollowing(people.node.id)}
              imageUrl={people.node.profile_image_url ?? ''}
              fullname={people.node.username ?? ''}
              onPress={() => {
                const userId = people.node.id;
                router.push({
                  pathname: '/screens/profile',
                  params: {
                    userId,
                  },
                });
              }}
              onFollowPress={handleToggleFollow(people.node.id)}
              isLoading={
                processedList.includes(people.node.id) &&
                (createFollowingLoading || removeFollowingLoading)
              }
            />
          )}
        />
      )}
    </ScreenContainer>
  );
}

const classes = {
  searchContainer: 'px-4 pb-4.5',
  searchField: 'w-full',
  contentContainer: 'px-4 pb-4 gap-5',
  loadingContainer: 'flex-1 flex-row items-center justify-center gap-2',
  loadingText: 'text-center',
};
