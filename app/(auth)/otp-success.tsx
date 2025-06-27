import React from 'react';

import { router } from 'expo-router';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { OTPSuccessIcon } from '@/assets/svg';
import { Button, Label } from '@/components/atoms';
import { Header } from '@/components/molecules';

const OTPSuccess = () => {
  const handleNext = () => {
    router.push('/(auth)/otp-success');
  };

  return (
    <SafeAreaView className={classes.container}>
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
    </SafeAreaView>
  );
};

const classes = {
  container: 'flex-1 bg-gray-100 dark:bg-gray-900 mx-5',
  title: 'text-2xl font-bold text-teal-600 mb-2 text-center mt-12',
  description: 'text-slate-500 text-md font-medium mb-8 text-center',
  countdown: 'text-md text-center font-bold mt-6 mb-5',
  link: 'text-slate-500 underline font-medium text-center ',
  successIconContainer: 'mx-auto text-center mt-12',
};

export default OTPSuccess;
