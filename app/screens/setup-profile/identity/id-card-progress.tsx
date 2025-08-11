import React from 'react';

import { router } from 'expo-router';
import { View } from 'react-native';

import { VerificationInProgressIcon } from '@/assets/svg';
import { Button, Label, ScreenContainer } from '@/components/atoms';
import { Header } from '@/components/molecules';

export default function IDCardProgressScreen() {
  const handleContinue = () => {
    router.push('/screens/setup-profile/identity/id-card');
  };

  return (
    <ScreenContainer className={classes.container}>
      <Header title="ID Verification" onBackPress={() => router.back()} />
      <View className={classes.content}>
        <VerificationInProgressIcon />
        <Label variant="title" className={classes.title}>
          ID Verification in Progress
        </Label>
        <Label className={classes.description}>
          Thank you! Your ID verification is in process and will be completed
          within 1 business day. You can use the app with some features
          restricted until your ID isn’t verified. We appreciate your patience.
        </Label>
      </View>
      <Button className={classes.button} onPress={handleContinue}>
        Continue Using the App
      </Button>
    </ScreenContainer>
  );
}

const classes = {
  container: 'flex-1',
  content: 'flex-1 items-center mt-14 px-4.5',
  title: 'text-primary-500 font-bold mb-2',
  description: 'text-slate-600 text-center text-md',
  button: 'm-4.5',
};
