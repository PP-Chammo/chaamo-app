import React from 'react';

import { router } from 'expo-router';
import { SafeAreaView } from 'react-native';

import { Button, Label } from '@/components/atoms';
import { useAuthStore } from '@/hooks/useAuthStore';

const SignInScreen = () => {
  const { signIn } = useAuthStore();

  return (
    <SafeAreaView className={classes.container}>
      <Label variant="title">Sign In Screen</Label>
      <Button
        onPress={() => {
          signIn();
          router.push('/(tabs)/home');
        }}
      >
        Home
      </Button>
      <Button onPress={() => router.push('/(auth)/sign-up')}>Sign Up</Button>
    </SafeAreaView>
  );
};

const classes = {
  container:
    'flex-1 items-center justify-center gap-5 bg-gray-100 dark:bg-gray-900',
};

export default SignInScreen;
