import { useCallback, useEffect, useState } from 'react';

import { Image } from 'expo-image';
import { router } from 'expo-router';
import { cssInterop } from 'nativewind';
import { ActivityIndicator, Alert, View } from 'react-native';

import {
  useGetProfilesLazyQuery,
  useGetUserAddressesLazyQuery,
} from '@/generated/graphql';
import { useProfileVar } from '@/hooks/useProfileVar';
import { ProfileStore } from '@/stores/profileStore';
import { DeepGet } from '@/types/helper';
import { supabase } from '@/utils/supabase';

export default function StartPage() {
  const [, setProfile] = useProfileVar();
  const [isLoading, setIsLoading] = useState(true);
  const [hasCheckedSession, setHasCheckedSession] = useState(false);
  const isDevelopment = process.env.NODE_ENV !== 'development';

  const [getProfile, { loading: loadingGetProfile }] = useGetProfilesLazyQuery({
    fetchPolicy: 'network-only',
  });

  const [getUserAddresses, { loading: loadingGetAddress }] =
    useGetUserAddressesLazyQuery({
      fetchPolicy: 'network-only',
    });

  cssInterop(Image, {
    className: {
      target: 'style',
    },
  });

  const handleSessionError = useCallback((message: string) => {
    Alert.alert('Session Error', message, [
      {
        text: 'OK',
        onPress: () => {
          setIsLoading(false);
          router.replace('/(auth)/sign-in');
        },
      },
    ]);
  }, []);

  const navigateToHome = useCallback(
    (isAuthenticated: boolean) => {
      const route = isAuthenticated ? '/(tabs)/home' : '/screens/onboarding';

      setIsLoading(false);
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
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error('Session error:', error);
        handleSessionError('Failed to get session. Please try again.');
        return;
      }

      if (data.session) {
        const userId = data?.session?.user.id;

        try {
          const profileResult = await getProfile({
            variables: {
              filter: {
                id: { eq: userId },
              },
            },
          });

          if (profileResult.error) {
            console.error('Profile fetch error:', profileResult.error);
            handleSessionError('Failed to load profile. Please re-login.');
            return;
          }

          const { profilesCollection } = profileResult.data || {};

          // Fetch user addresses
          const addressesResult = await getUserAddresses({
            variables: {
              filter: {
                user_id: { eq: userId },
              },
            },
          });

          const profileData = profilesCollection?.edges[0]?.node;
          const addressData =
            addressesResult?.data?.user_addressesCollection?.edges[0]?.node;

          setProfile({
            ...data?.session?.user,
            profile: { ...profileData, ...addressData } as DeepGet<
              ProfileStore,
              ['profile']
            >,
          });

          navigateToHome(!!userId);
        } catch (error) {
          console.error('Data fetching error:', error);
          handleSessionError('Failed to load user data. Please re-login.');
        }
      } else {
        setIsLoading(false);
        router.replace('/(auth)/sign-in');
      }
    } catch (error) {
      console.error('Unexpected error during session check:', error);
      handleSessionError('An unexpected error occurred. Please try again.');
    }
  }, [
    getProfile,
    getUserAddresses,
    handleSessionError,
    hasCheckedSession,
    navigateToHome,
    setProfile,
  ]);

  useEffect(() => {
    if (!hasCheckedSession) {
      checkSession();
    }
  }, [checkSession, hasCheckedSession]);

  if (isLoading || loadingGetProfile || loadingGetAddress) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View className={classes.container}>
      <Image
        source={require('@/assets/images/splash-screen.gif')}
        className={classes.image}
        contentFit="contain"
      />
    </View>
  );
}

const classes = {
  container: 'bg-splash w-full h-full',
  image: 'absolute inset-0',
};
