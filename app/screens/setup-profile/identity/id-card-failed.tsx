import React from 'react';

import { router } from 'expo-router';
import { View } from 'react-native';

import { VerificationFailedIcon } from '@/assets/svg';
import { Button, Label, ScreenContainer } from '@/components/atoms';
import { Header } from '@/components/molecules';

export default function IDCardFailedScreen() {
  const handleReUpload = () => {
    router.push('/screens/setup-profile/identity/id-card');
  };

  return (
    <ScreenContainer className={classes.container}>
      <Header title="ID Verification" onBackPress={() => router.back()} />
      <View className={classes.content}>
        <VerificationFailedIcon />
        <Label variant="title" className={classes.title}>
          Oops! Verification Unsuccessful
        </Label>
        <Label className={classes.description}>
          Your documents could not be verified. Please re-upload them to
          proceed.
        </Label>
      </View>
      <Button className={classes.button} onPress={handleReUpload}>
        Re-upload Documents
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
