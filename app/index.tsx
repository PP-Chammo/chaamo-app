import { useEffect } from 'react';

import { Image } from 'expo-image';
import { Redirect, router } from 'expo-router';
import { cssInterop } from 'nativewind';

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
    return <Redirect href="/home" />;
  }

  return (
    <Image
      source={require('@/assets/images/splash-screen.gif')}
      className="w-full h-full"
      contentFit="contain"
    />
  );
}
