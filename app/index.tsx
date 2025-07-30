import { useCallback, useEffect } from 'react';

import { Session } from '@supabase/supabase-js';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { cssInterop } from 'nativewind';
import { View } from 'react-native';

import { useProfileVar } from '@/hooks/useProfileVar';
import { fnGetStorage } from '@/utils/storage';

export default function StartPage() {
  const [, setProfileVar] = useProfileVar();
  const isDevelopment = process.env.NODE_ENV === 'development';

  cssInterop(Image, {
    className: {
      target: 'style',
    },
  });

  const checkSession = useCallback(async () => {
    const session = await fnGetStorage<Session>('session');
    if (session) {
      setProfileVar(session.user);
      return router.replace('/(tabs)/home');
    }

    const timeout = setTimeout(() => {
      router.replace('/screens/onboarding');
    }, 6000);

    return () => clearTimeout(timeout);
  }, [setProfileVar]);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

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
