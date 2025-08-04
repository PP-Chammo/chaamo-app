import React, { memo, useCallback, useMemo } from 'react';

import { useFocusEffect } from 'expo-router';

import {
  ListContainer,
  ListContainerDirection,
  People,
} from '@/components/molecules';
import {
  useCreateFollowersMutation,
  useGetFollowersQuery,
  useGetVwFilteredProfilesLazyQuery,
  useRemoveFollowersMutation,
} from '@/generated/graphql';
import { useUserVar } from '@/hooks/useUserVar';

const PeopleList = memo(function PeopleList() {
  const [user] = useUserVar();

  const { data: followedData, refetch: refetchFollowers } =
    useGetFollowersQuery();
  const [getPeoples, { data, loading }] = useGetVwFilteredProfilesLazyQuery({
    fetchPolicy: 'cache-and-network',
    variables: {
      filter: {
        id: { neq: user?.id },
      },
    },
  });
  const [createFollowers] = useCreateFollowersMutation();
  const [removeFollowers] = useRemoveFollowersMutation();

  const followedPeoples = useMemo(
    () => followedData?.followersCollection?.edges ?? [],
    [followedData?.followersCollection?.edges],
  );

  const peoples = useMemo(
    () => data?.vw_filtered_profilesCollection?.edges ?? [],
    [data?.vw_filtered_profilesCollection?.edges],
  );

  const getIsFollowed = useCallback(
    (userId: string) =>
      followedPeoples.some((edge) => edge.node.followed_user_id === userId),
    [followedPeoples],
  );

  const handleToggleFollow = useCallback(
    (userId: string) => () => {
      if (getIsFollowed(userId)) {
        removeFollowers({
          variables: {
            filter: {
              following_user_id: { eq: user?.id },
              followed_user_id: { eq: userId },
            },
          },
          onCompleted: () => {
            refetchFollowers();
          },
        });
      } else {
        createFollowers({
          variables: {
            objects: [
              {
                following_user_id: user?.id,
                followed_user_id: userId,
              },
            ],
          },
          onCompleted: () => {
            refetchFollowers();
          },
        });
      }
    },
    [
      createFollowers,
      getIsFollowed,
      refetchFollowers,
      removeFollowers,
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
          followed={getIsFollowed(people.node.id)}
          imageUrl={people.node.profile_image_url ?? ''}
          fullname={people.node.username ?? ''}
          onPress={() => {
            console.log(`People id ${people.node.id}`);
          }}
          onFollowPress={handleToggleFollow(people.node.id)}
        />
      )}
    </ListContainer>
  );
});

export default PeopleList;
