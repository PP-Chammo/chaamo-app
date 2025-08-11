import React, { memo, useCallback, useMemo, useState } from 'react';

import { router, useFocusEffect } from 'expo-router';

import {
  ListContainer,
  ListContainerDirection,
  People,
} from '@/components/molecules';
import {
  useCreateFollowsMutation,
  useGetVwPeoplesLazyQuery,
  useRemoveFollowsMutation,
} from '@/generated/graphql';
import { useFollows } from '@/hooks/useFollows';
import { useUserVar } from '@/hooks/useUserVar';

const PeopleList = memo(function PeopleList() {
  const [user] = useUserVar();
  const { getIsFollowing } = useFollows();

  const [processedList, setProcessedList] = useState<string[]>([]);

  const [getPeoples, { data, loading }] = useGetVwPeoplesLazyQuery({
    fetchPolicy: 'cache-and-network',
    variables: {
      last: 5,
    },
  });
  const [createFollow, { loading: createFollowLoading }] =
    useCreateFollowsMutation();
  const [removeFollow, { loading: removeFollowLoading }] =
    useRemoveFollowsMutation();

  const peoples = useMemo(
    () => data?.vw_peoplesCollection?.edges ?? [],
    [data?.vw_peoplesCollection?.edges],
  );

  const handleToggleFollow = useCallback(
    (followeeUserId: string) => () => {
      setProcessedList((prev) => [...prev, followeeUserId]);
      if (getIsFollowing(followeeUserId)) {
        removeFollow({
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
        createFollow({
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
    [createFollow, getIsFollowing, removeFollow, user?.id],
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
            (createFollowLoading || removeFollowLoading)
          }
        />
      )}
    </ListContainer>
  );
});

export default PeopleList;
