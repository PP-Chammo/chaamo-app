import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';

import { Image } from 'expo-image';
import { router } from 'expo-router';
import { cssInterop } from 'nativewind';
import { Alert, View } from 'react-native';

import { useUserVar } from '@/hooks/useUserVar';
import { updateProfileSession } from '@/utils/auth';

cssInterop(Image, {
  className: {
    target: 'style',
  },
});

export default function StartPage() {
  const [, setUser] = useUserVar();
  const [hasCheckedSession, setHasCheckedSession] = useState(false);
  const [navigatePage, setNavigatePage] = useState<
    '/(tabs)/home' | '/screens/onboarding'
  >('/screens/onboarding');

  const isDevelopment = useMemo(
    () => process.env.NODE_ENV === 'development',
    [],
  );

  useEffect(() => {
    if (!isDevelopment) {
      const timeout = setTimeout(() => {
        router.replace(navigatePage);
      }, 4300);

      return () => clearTimeout(timeout);
    }
  }, [isDevelopment, navigatePage]);

  const checkSession = useCallback(async () => {
    // Prevent multiple executions
    if (hasCheckedSession) {
      return;
    }

    setHasCheckedSession(true);

    try {
      await updateProfileSession(setUser, (isSuccess) => {
        if (isSuccess) {
          if (isDevelopment) {
            return router.replace('/(tabs)/home');
          }
          return setNavigatePage('/(tabs)/home');
        } else {
          if (isDevelopment) {
            return router.replace('/(auth)/sign-in');
          }

          return setNavigatePage('/screens/onboarding');
        }
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
  }, [hasCheckedSession, isDevelopment, setUser]);

  useLayoutEffect(() => {
    if (!hasCheckedSession) {
      checkSession();
    }
  }, [checkSession, hasCheckedSession]);

  if (isDevelopment) return null;

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
