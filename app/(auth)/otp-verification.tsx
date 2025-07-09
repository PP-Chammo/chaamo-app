import React, { useState } from 'react';

import { router } from 'expo-router';
import { View } from 'react-native';

import { Button, Label, ScreenContainer } from '@/components/atoms';
import { Header, OtpInput } from '@/components/molecules';
import { TextChangeParams } from '@/domains';

interface OTPVerificationForm {
  otp: string;
}

export default function OTPVerificationScreen() {
  const [form, setForm] = useState<OTPVerificationForm>({
    otp: '',
  });

  const [error, setError] = useState<boolean>(false);

  const handleChange = ({ name, value }: TextChangeParams) => {
    setError(false);
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleVerification = () => {
    const otp = '123456';

    if (form.otp === otp) return router.push('/(auth)/otp-success');
    return setError(true);
  };

  const handleResendOTP = () => {
    console.log('Resend OTP');
  };

  return (
    <ScreenContainer>
      <Header title="OTP" onBackPress={() => router.back()} />
      <View className={classes.container}>
        <Label className={classes.title} variant="title">
          Phone Number Verification
        </Label>
        <Label className={classes.description}>
          Please enter the OTP. We&apos;ve just send to{' '}
          <Label className={classes.phoneNumber}>12** ****90</Label>
        </Label>
        <OtpInput error={error} onChange={handleChange} name="otp" />
        <Button
          disabled={form.otp.length !== 6}
          onPress={handleVerification}
          className={classes.sendButton}
        >
          Verify Now
        </Button>
        <Label className={classes.countdown}>02:00</Label>
        <Button
          variant="link"
          className={classes.link}
          onPress={handleResendOTP}
        >
          Resend OTP
        </Button>
      </View>
    </ScreenContainer>
  );
}

const classes = {
  title: 'text-3xl font-bold text-teal-600 mb-2',
  description: 'text-slate-500 text-lg mb-8',
  phoneNumber: 'text-slate-500 font-bold',
  sendButton: 'mt-8',
  countdown: 'text-md text-center font-bold mt-6 mb-5',
  link: 'text-slate-500 underline font-medium text-center ',
  container: 'flex-1 px-4.5',
};
