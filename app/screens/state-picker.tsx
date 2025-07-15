import React from 'react';

import { router } from 'expo-router';

import { ScreenContainer } from '@/components/atoms';
import { Header } from '@/components/molecules';
import { SelectableList } from '@/components/organisms';
import { STATES } from '@/constants/dummy';
import { useSelectWithScreenVar } from '@/hooks/useSelectWithScreenVar';

export default function StatePickerScreen() {
  const [state, setState] = useSelectWithScreenVar();

  const handleSelectState = (selectedState: string) => {
    setState({ selectedState });
  };

  return (
    <ScreenContainer>
      <Header title="Select State" onBackPress={() => router.back()} />
      <SelectableList
        value={state.selectedState}
        data={STATES}
        onSelect={handleSelectState}
      />
    </ScreenContainer>
  );
}
