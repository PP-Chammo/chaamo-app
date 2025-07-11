import React, { memo } from 'react';

import {
  ListContainer,
  ListContainerDirection,
  People,
} from '@/components/molecules';
import { dummyDiscoverPeopleList } from '@/constants/dummy';

const PeopleList = memo(function PeopleList() {
  return (
    <ListContainer
      listDirection={ListContainerDirection.None}
      title="People"
      onViewAllHref="/screens/people"
      data={dummyDiscoverPeopleList}
    >
      {(people: (typeof dummyDiscoverPeopleList)[number]) => (
        <People
          key={people.id}
          imageUrl={people.imageUrl}
          fullname={people.fullname}
          onPress={() => {
            console.log(`People pressed for card ${people.id}`);
          }}
          onFollowPress={() => {
            console.log(`Follow pressed for card ${people.id}`);
          }}
        />
      )}
    </ListContainer>
  );
});

export default PeopleList;
