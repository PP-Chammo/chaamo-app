import React, { useState } from 'react';

import { router } from 'expo-router';
import { FlatList, Pressable, Text, View } from 'react-native';

import { Icon, ScreenContainer } from '@/components/atoms';
import { Header, TextField } from '@/components/molecules';
import { STATES } from '@/constants/dummy';
import { useSelectWithScreenStore } from '@/hooks/useSelectWithScreenStore';
import { getColor } from '@/utils/getColor';

export default function StatePickerScreen() {
  const [search, setSearch] = useState('');
  const filteredStates = STATES.filter((s) =>
    s.toLowerCase().includes(search.toLowerCase()),
  );

  const { setSelectedState } = useSelectWithScreenStore();

  const handleSelectState = (state: string) => {
    setSelectedState(state);
  };

  return (
    <ScreenContainer>
      <Header
        className={classes.header}
        title="Select State"
        onBackPress={() => router.back()}
      />
      <View className={classes.searchContainer}>
        <TextField
          name="search"
          placeholder="Search"
          value={search}
          onChange={({ value }) => setSearch(value)}
          leftIcon={
            <Icon name="magnify" size={24} color={getColor('slate-700')} />
          }
        />
      </View>
      <View className={classes.listContainer}>
        <FlatList
          data={filteredStates}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => handleSelectState(item)}
              className={classes.stateItem}
            >
              <Text>{item}</Text>
            </Pressable>
          )}
        />
      </View>
    </ScreenContainer>
  );
}

const classes = {
  header: 'm-6',
  searchContainer: 'px-6 bg-slate-100/50',
  stateItem: 'p-4 border-b border-gray-200',
  listContainer: 'mx-6 mt-20',
};
