import { useEffect } from 'react';

import { Image } from 'expo-image';
import { Redirect, router } from 'expo-router';
import { cssInterop } from 'nativewind';
import { View } from 'react-native';

export default function StartPage() {
  const isDevelopment = process.env.NODE_ENV === 'development';

  cssInterop(Image, {
    className: {
      target: 'style',
    },
  });

  useEffect(() => {
    if (!isDevelopment) {
      const timeout = setTimeout(() => {
        router.replace('/screens/onboarding');
      }, 6000);

      return () => clearTimeout(timeout);
    }
  }, [isDevelopment]);

  if (isDevelopment) {
    return <Redirect href="/(tabs)/home" />;
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
