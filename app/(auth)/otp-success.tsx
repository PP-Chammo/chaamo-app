import React from 'react';

import { router } from 'expo-router';
import { View } from 'react-native';

import { OTPSuccessIcon } from '@/assets/svg';
import { Button, Label, ScreenContainer } from '@/components/atoms';
import { Header } from '@/components/molecules';

export default function OTPSuccessScreen() {
  const handleNext = () => {
    router.push('/(auth)/otp-success');
  };

  return (
    <ScreenContainer>
      <Header title="OTP Verified" />
      <View className={classes.successIconContainer}>
        <OTPSuccessIcon />
      </View>
      <Label className={classes.title} variant="title">
        Congratulations!
      </Label>
      <Label className={classes.description}>
        Your Phone Number has been verified!
      </Label>
      <Button onPress={handleNext}>Next</Button>
    </ScreenContainer>
  );
}

const classes = {
  title: 'text-2xl font-bold text-teal-600 mb-2 text-center mt-12',
  description: 'text-slate-500 text-md font-medium mb-8 text-center',
  successIconContainer: 'mx-auto text-center mt-12',
};
