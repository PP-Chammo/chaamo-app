import React from 'react';

import { router } from 'expo-router';

import { ScreenContainer } from '@/components/atoms';
import { Header } from '@/components/molecules';
import { SelectableList } from '@/components/organisms';
import { STATES } from '@/constants/dummy';
import { useSelectWithScreenStore } from '@/hooks/useSelectWithScreenStore';

export default function StatePickerScreen() {
  const { selectedState, setSelectedState } = useSelectWithScreenStore();

  const handleSelectState = (state: string) => {
    setSelectedState(state);
  };

  return (
    <ScreenContainer>
      <Header title="Select State" onBackPress={() => router.back()} />
      <SelectableList
        value={selectedState}
        data={STATES}
        onSelect={handleSelectState}
      />
    </ScreenContainer>
  );
}
