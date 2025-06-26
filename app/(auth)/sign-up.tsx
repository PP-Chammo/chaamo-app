import React from 'react';

import { router } from 'expo-router';
import { SafeAreaView } from 'react-native';

import { Button, Label } from '@/components/atoms';

const SignUpScreen = () => {
  return (
    <SafeAreaView className={classes.container}>
      <Label variant="title">Sign Up</Label>
      <Button onPress={() => router.push('/(auth)/sign-in')}>Sign In</Button>
    </SafeAreaView>
  );
};

const classes = {
  container:
    'flex-1 items-center justify-center gap-5 bg-gray-100 dark:bg-gray-900',
};

export default SignUpScreen;
