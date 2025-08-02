import React, { useCallback, useMemo } from 'react';

import { router } from 'expo-router';
import { View } from 'react-native';

import { Button, ScreenContainer } from '@/components/atoms';
import { Header } from '@/components/molecules';
import { SelectableList } from '@/components/organisms';
import { currencyMap } from '@/constants/currencies';
import { useUpdateProfileMutation } from '@/generated/graphql';
import { useUserVar } from '@/hooks/useUserVar';

export default function ChangeCurrencyScreen() {
  const [user, setUser] = useUserVar();

  const [updateProfile, { loading }] = useUpdateProfileMutation();

  const currencyList = useMemo(() => {
    return Object.keys(currencyMap);
  }, []);

  const handleSelect = useCallback(
    (value: string) => {
      setUser({ 'profile.currency': value });
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

  return (
    <ScreenContainer>
      <Header title="Change Currency" onBackPress={() => router.back()} />
      <View className="flex-1">
        <SelectableList
          value={user?.profile?.currency ?? ''}
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
