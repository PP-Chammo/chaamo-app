import React from 'react';

import { router } from 'expo-router';

import { ScreenContainer } from '@/components/atoms';
import { Header } from '@/components/molecules';
import { SelectableList } from '@/components/organisms';
import { COUNTRIES } from '@/constants/dummy';
import { useSelectWithScreenVar } from '@/hooks/useSelectWithScreenVar';

export default function CountryPickerScreen() {
  const [state, setState] = useSelectWithScreenVar();

  const handleSelectCountry = (selectedCountry: string) => {
    setState({ selectedCountry });
  };

  return (
    <ScreenContainer>
      <Header title="Select Country" onBackPress={() => router.back()} />
      <SelectableList
        value={state.selectedCountry}
        data={COUNTRIES}
        onSelect={handleSelectCountry}
      />
    </ScreenContainer>
  );
}
