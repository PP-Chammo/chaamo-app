import React from 'react';

import { router } from 'expo-router';

import { ScreenContainer } from '@/components/atoms';
import { Header } from '@/components/molecules';
import { SelectableList } from '@/components/organisms';
import { COUNTRIES } from '@/constants/dummy';
import { useSelectWithScreenStore } from '@/hooks/useSelectWithScreenStore';

export default function CountryPickerScreen() {
  const { selectedCountry, setSelectedCountry } = useSelectWithScreenStore();

  const handleSelectCountry = (country: string) => {
    setSelectedCountry(country);
  };

  return (
    <ScreenContainer>
      <Header title="Select Country" onBackPress={() => router.back()} />
      <SelectableList
        value={selectedCountry}
        data={COUNTRIES}
        onSelect={handleSelectCountry}
      />
    </ScreenContainer>
  );
}
