import React, { useCallback, useState } from 'react';

import { router } from 'expo-router';
import { View } from 'react-native';

import { Button, ScreenContainer } from '@/components/atoms';
import { Header } from '@/components/molecules';
import { SelectableList } from '@/components/organisms';
import { CURRENCIES } from '@/constants/dummy';

export default function ChangeCurrencyScreen() {
  const [selectedCurrency, setSelectedCurrency] = useState<string>('');

  const handleSaveChanges = useCallback(() => {
    router.back();
  }, []);

  return (
    <ScreenContainer>
      <Header title="Change Currency" onBackPress={() => router.back()} />
      <View className="flex-1">
        <SelectableList
          value={selectedCurrency}
          data={CURRENCIES}
          onSelect={setSelectedCurrency}
        />
      </View>
      <Button
        disabled={!selectedCurrency}
        className="mx-4.5 mb-10"
        onPress={handleSaveChanges}
      >
        Save Changes
      </Button>
    </ScreenContainer>
  );
}
