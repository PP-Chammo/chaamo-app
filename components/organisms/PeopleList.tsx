import React, { memo } from 'react';

import { View } from 'react-native';

import { GroupWithLink, People } from '@/components/molecules';
import { dummyDiscoverPeopleList } from '@/constants/dummy';

const PeopleList = memo(function PeopleList() {
  return (
    <GroupWithLink
      title="Discover People"
      onViewAllHref="/screens/people"
      className={classes.headerContainer}
    >
      <View className={classes.container}>
        {dummyDiscoverPeopleList.map((card) => (
          <People
            key={card.id}
            imageUrl={card.imageUrl}
            fullname={card.fullname}
            onFollowPress={() => {
              console.log(`Favorite pressed for card ${card.id}`);
            }}
          />
        ))}
      </View>
    </GroupWithLink>
  );
});

const classes = {
  headerContainer: 'pt-5',
  container: 'flex flex-col p-4.5 gap-5',
  titleContainer: 'px-4.5 pt-5',
  viewAllText: 'text-teal-500 font-bold',
};

export default PeopleList;
