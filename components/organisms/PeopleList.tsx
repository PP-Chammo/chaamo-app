import React, { memo, useCallback, useMemo } from 'react';

import { router, useFocusEffect } from 'expo-router';

import {
  ListContainer,
  ListContainerDirection,
  People,
} from '@/components/molecules';
import {
  useCreateFollowsMutation,
  useGetVwFilteredProfilesLazyQuery,
  useRemoveFollowsMutation,
} from '@/generated/graphql';
import { useUserVar } from '@/hooks/useUserVar';

const PeopleList = memo(function PeopleList() {
  const [user] = useUserVar();

  const [getPeoples, { data, loading, refetch }] =
    useGetVwFilteredProfilesLazyQuery({
      fetchPolicy: 'cache-and-network',
      variables: {
        last: 5,
      },
    });
  const [createFollowing] = useCreateFollowsMutation();
  const [removeFollowing] = useRemoveFollowsMutation();

  const peoples = useMemo(
    () => data?.vw_filtered_profilesCollection?.edges ?? [],
    [data?.vw_filtered_profilesCollection?.edges],
  );

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

  if (loading || !user?.id) {
    return null;
  }

  return (
    <ListContainer
      listDirection={ListContainerDirection.None}
      title="People"
      onViewAllHref="/screens/people"
      data={peoples}
    >
      {(people) => (
        <People
          key={people.node.id}
          size="sm"
          followed={people.node.is_follow ?? false}
          imageUrl={people.node.profile_image_url ?? ''}
          fullname={people.node.username ?? ''}
          onPress={() => {
            const userId = people.node.id;
            router.push(`/screens/public-profile?publicUserId=${userId}`);
          }}
          onFollowPress={handleToggleFollow(
            people.node.id,
            people.node.is_follow ?? false,
          )}
        />
      )}
    </ListContainer>
  );
});

export default PeopleList;
