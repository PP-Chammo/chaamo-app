import { useCallback, useEffect, useState } from 'react';

import { Image } from 'expo-image';
import { router } from 'expo-router';
import { cssInterop } from 'nativewind';
import { Alert, View } from 'react-native';

import { useProfileVar } from '@/hooks/useProfileVar';
import { updateProfileSession } from '@/utils/auth';

export default function StartPage() {
  const [, setProfile] = useProfileVar();
  const [hasCheckedSession, setHasCheckedSession] = useState(false);
  const isDevelopment = process.env.NODE_ENV !== 'development';

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
          router.replace('/(auth)/sign-in');
        },
      },
    ]);
  }, []);

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
      await updateProfileSession(setProfile, (isSuccess, userId) => {
        if (isSuccess) {
          navigateToHome(!!userId);
        }
      });
    } catch (error) {
      console.error('Unexpected error during session check:', error);
      handleSessionError('An unexpected error occurred. Please try again.');
    }
  }, [handleSessionError, hasCheckedSession, navigateToHome, setProfile]);

  useEffect(() => {
    if (!hasCheckedSession) {
      checkSession();
    }
  }, [checkSession, hasCheckedSession]);

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
