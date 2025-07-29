import React, { memo } from 'react';

import {
  ListContainer,
  ListContainerDirection,
  People,
} from '@/components/molecules';
import { useGetPeoplesQuery } from '@/generated/graphql';
import { useProfileVar } from '@/hooks/useProfileVar';

const PeopleList = memo(function PeopleList() {
  const [profile] = useProfileVar();
  const { data, loading } = useGetPeoplesQuery({
    variables: {
      filter: {
        id: { neq: profile?.id },
      },
    },
  });
  const peoples = data?.profilesCollection?.edges ?? [];

  if (loading) {
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
          imageUrl={people.node.profile_image_url ?? ''}
          fullname={people.node.username}
          onPress={() => {
            console.log(`People id ${people.node.id}`);
          }}
          onFollowPress={() => {
            console.log(`Follow people id ${people.node.id}`);
          }}
        />
      )}
    </ListContainer>
  );
});

export default PeopleList;
