import { useCallback, useEffect } from 'react';

import { Image } from 'expo-image';
import { router } from 'expo-router';
import { cssInterop } from 'nativewind';
import { View } from 'react-native';

import { fnGetStorage } from '@/utils/storage';

export default function StartPage() {
  const isDevelopment = process.env.NODE_ENV === 'development';

  cssInterop(Image, {
    className: {
      target: 'style',
    },
  });

  const checkSession = useCallback(async () => {
    const session = await fnGetStorage('session');
    if (isDevelopment) {
      if (session) {
        router.replace('/(tabs)/home');
      } else {
        router.replace('/(auth)/sign-in');
      }
    }
  }, [isDevelopment]);

  useEffect(() => {
    if (isDevelopment) {
      checkSession();
    } else {
      const timeout = setTimeout(() => {
        router.replace('/screens/onboarding');
      }, 6000);

      return () => clearTimeout(timeout);
    }
  }, [isDevelopment, checkSession]);

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
