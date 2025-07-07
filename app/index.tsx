import { useEffect } from 'react';

import { Image } from 'expo-image';
import { router } from 'expo-router';

export default function StartPage() {
  // Navigate to /onboarding after 7 seconds
  useEffect(() => {
    const timeout = setTimeout(() => {
      router.replace('/screens/onboarding');
    }, 6000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <Image
      source={require('../assets/images/splash-screen.gif')}
      style={{ width: '100%', height: '100%' }}
      contentFit="contain"
    />
  );
}
