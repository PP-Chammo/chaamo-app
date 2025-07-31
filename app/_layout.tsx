import 'react-native-url-polyfill/auto'; // this needed for supabase to be worked on react-native , dont remove it
import { useCallback, useLayoutEffect, useMemo, useState } from 'react';

import { router, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Alert } from 'react-native';

import { useProfileVar } from '@/hooks/useProfileVar';
import { ApolloProvider, default as client } from '@/utils/apollo';
import { updateProfileSession } from '@/utils/auth';
import { getColor } from '@/utils/getColor';

import '@/global.css';

export default function RootLayout() {
  const [, setProfile] = useProfileVar();
  const [hasCheckedSession, setHasCheckedSession] = useState(false);

  const isDevelopment = useMemo(
    () => process.env.NODE_ENV !== 'development',
    [],
  );

  const navigateToHome = useCallback(
    (isAuthenticated: boolean) => {
      const route = isAuthenticated ? '/(tabs)/home' : '/screens/onboarding';

      if (!isDevelopment) {
        const timeout = setTimeout(() => {
          router.replace(route);
        }, 6000);

        return () => clearTimeout(timeout);
      }

      return router.replace(route);
    },
    [isDevelopment],
  );

  const checkSession = useCallback(async () => {
    // Prevent multiple executions
    if (hasCheckedSession) {
      return;
    }

    setHasCheckedSession(true);

    try {
      await updateProfileSession(setProfile, (isSuccess) => {
        navigateToHome(isSuccess);
      });
    } catch (error) {
      console.error('Unexpected error during session check:', error);
      Alert.alert('Session Error', 'An unexpected error occurred.', [
        {
          text: 'OK',
          onPress: () => {
            router.replace('/(auth)/sign-in');
          },
        },
      ]);
    }
  }, [hasCheckedSession, navigateToHome, setProfile]);

  useLayoutEffect(() => {
    if (!hasCheckedSession) {
      checkSession();
    }
  }, [checkSession, hasCheckedSession]);

  return (
    <ApolloProvider client={client}>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: getColor('white') },
        }}
      >
        <Stack.Screen name="index" />
      </Stack>
      <StatusBar style="auto" />
    </ApolloProvider>
  );
}
