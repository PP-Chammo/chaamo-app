import React, { useCallback, useMemo } from 'react';

import { router } from 'expo-router';
import { View } from 'react-native';

import { Button, ScreenContainer } from '@/components/atoms';
import { Header } from '@/components/molecules';
import { SelectableList } from '@/components/organisms';
import { currencyCountryMap, currencyMap } from '@/constants/currencies';
import { useUpdateProfileMutation } from '@/generated/graphql';
import { useUserVar } from '@/hooks/useUserVar';

export default function ChangeCurrencyScreen() {
  const [user, setUser] = useUserVar();

  const [updateProfile, { loading }] = useUpdateProfileMutation();

  const currencyList = useMemo(() => {
    return Object.keys(currencyMap).map((currency) => {
      const flag =
        currencyCountryMap[currency as keyof typeof currencyCountryMap] || '';
      return `${flag} ${currency}`;
    });
  }, []);

  const handleSelect = useCallback(
    (value: string) => {
      const currencyCode = value.split(' ')[1];
      setUser({ 'profile.currency': currencyCode });
    },
    [setUser],
  );

  const handleSaveChanges = useCallback(() => {
    updateProfile({
      variables: {
        filter: {
          id: { eq: user.id },
        },
        set: {
          currency: user.profile?.currency,
        },
      },
      onCompleted: () => {
        router.back();
      },
    });
  }, [updateProfile, user.id, user.profile?.currency]);

  const currentValue = useMemo(() => {
    const currency = user?.profile?.currency;
    if (!currency) return '';
    const flag =
      currencyCountryMap[currency as keyof typeof currencyCountryMap] || '';
    return `${flag} ${currency}`;
  }, [user?.profile?.currency]);

  return (
    <ScreenContainer>
      <Header title="Change Currency" onBackPress={() => router.back()} />
      <View className="flex-1">
        <SelectableList
          value={currentValue}
          data={currencyList}
          onSelect={handleSelect}
        />
      </View>
      <Button
        className="mx-4.5 mb-10"
        onPress={handleSaveChanges}
        disabled={!user?.profile?.currency || loading}
        loading={loading}
      >
        Save Changes
      </Button>
    </ScreenContainer>
  );
}
