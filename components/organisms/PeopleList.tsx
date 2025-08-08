import React, { memo, useCallback, useMemo } from 'react';

import { router, useFocusEffect } from 'expo-router';

import {
  ListContainer,
  ListContainerDirection,
  People,
} from '@/components/molecules';
import {
  useCreateFollowsMutation,
  useGetFollowsQuery,
  useGetVwFilteredProfilesLazyQuery,
  useRemoveFollowsMutation,
} from '@/generated/graphql';
import { useUserVar } from '@/hooks/useUserVar';

const PeopleList = memo(function PeopleList() {
  const [user] = useUserVar();

  const { data: followedData, refetch: refetchFollowing } =
    useGetFollowsQuery();
  const [getPeoples, { data, loading }] = useGetVwFilteredProfilesLazyQuery({
    fetchPolicy: 'cache-and-network',
    variables: {
      filter: {
        id: { neq: user?.id },
      },
    },
  });
  const [createFollowing] = useCreateFollowsMutation();
  const [removeFollowing] = useRemoveFollowsMutation();

  const followedPeoples = useMemo(
    () => followedData?.followsCollection?.edges ?? [],
    [followedData?.followsCollection?.edges],
  );

  const peoples = useMemo(
    () => data?.vw_filtered_profilesCollection?.edges ?? [],
    [data?.vw_filtered_profilesCollection?.edges],
  );

  const getIsFollowee = useCallback(
    (userId: string) =>
      followedPeoples.some((edge) => edge.node.followee_user?.id === userId),
    [followedPeoples],
  );

  const handleToggleFollow = useCallback(
    (userId: string) => () => {
      if (getIsFollowee(userId)) {
        removeFollowing({
          variables: {
            filter: {
              followee_user_id: { eq: userId },
              follower_user_id: { eq: user?.id },
            },
          },
          onCompleted: () => {
            refetchFollowing();
          },
        });
      } else {
        createFollowing({
          variables: {
            objects: [
              {
                followee_user_id: userId,
                follower_user_id: user?.id,
              },
            ],
          },
          onCompleted: () => {
            refetchFollowing();
          },
        });
      }
    },
    [
      createFollowing,
      getIsFollowee,
      refetchFollowing,
      removeFollowing,
      user?.id,
    ],
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
          followed={getIsFollowee(people.node.id)}
          imageUrl={people.node.profile_image_url ?? ''}
          fullname={people.node.username ?? ''}
          onPress={() => {
            const userId = people.node.id;
            router.push(`/screens/public-profile?publicUserId=${userId}`);
          }}
          onFollowPress={handleToggleFollow(people.node.id)}
        />
      )}
    </ListContainer>
  );
});

export default PeopleList;
