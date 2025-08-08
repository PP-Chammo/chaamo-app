import { useCallback, useMemo, useState } from 'react';

import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import { ActivityIndicator, FlatList, View } from 'react-native';

import { Label, ScreenContainer } from '@/components/atoms';
import { Header, People, TextField } from '@/components/molecules';
import { TextChangeParams } from '@/domains';
import {
  useCreateFollowsMutation,
  useGetVwFilteredProfilesLazyQuery,
  useRemoveFollowsMutation,
} from '@/generated/graphql';
import useDebounce from '@/hooks/useDebounce';
import { useUserVar } from '@/hooks/useUserVar';
import { getColor } from '@/utils/getColor';

export default function PeopleScreen() {
  const [user] = useUserVar();
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const [getPeoples, { data, loading, refetch }] =
    useGetVwFilteredProfilesLazyQuery({
      fetchPolicy: 'cache-and-network',
      variables: {
        filter: {
          username: debouncedSearchQuery
            ? { ilike: `%${debouncedSearchQuery}%` }
            : undefined,
        },
      },
    });
  const [createFollowing] = useCreateFollowsMutation();
  const [removeFollowing] = useRemoveFollowsMutation();

  const peoples = useMemo(
    () => data?.vw_filtered_profilesCollection?.edges ?? [],
    [data?.vw_filtered_profilesCollection?.edges],
  );

  const handleSearchChange = useCallback(({ value }: TextChangeParams) => {
    setSearchQuery(value);
  }, []);

  const handleToggleFollow = useCallback(
    (followeeUserId: string, isFollowed: boolean) => () => {
      if (isFollowed) {
        removeFollowing({
          variables: {
            filter: {
              follower_user_id: { eq: user?.id },
              followee_user_id: { eq: followeeUserId },
            },
          },
          onCompleted: () => {
            refetch();
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
            refetch();
          },
        });
      }
    },
    [createFollowing, refetch, removeFollowing, user?.id],
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
      <Header title="People List" onBackPress={() => router.back()} />
      <View className={classes.searchContainer}>
        <TextField
          name="search"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search people..."
          className={classes.searchField}
        />
      </View>
      {loading ? (
        <View className={classes.loadingContainer}>
          <ActivityIndicator color={getColor('primary-500')} />
          <Label className={classes.loadingText}>Loading...</Label>
        </View>
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
              followed={people.node.is_follow ?? false}
              imageUrl={people.node.profile_image_url ?? ''}
              fullname={people.node.username ?? ''}
              onPress={() => {
                console.log(`People id ${people.node.id}`);
              }}
              onFollowPress={handleToggleFollow(
                people.node.id,
                people.node.is_follow ?? false,
              )}
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
  contentContainer: 'px-4 pb-4 gap-3',
  loadingContainer: 'flex-1 flex-row items-center justify-center gap-2',
  loadingText: 'text-center',
};
