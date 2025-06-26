import React, { useState } from 'react';

import { Link, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button, Label } from '@/components/atoms';
import Header from '@/components/atoms/Header';
import { OtpInput } from '@/components/molecules';

const OTPVerification = () => {
  const [form, setForm] = useState({
    otp: '',
  });

  const [error, setError] = useState(false);

  const handleChange = ({ name, value }: { name: string; value: string }) => {
    setError(false);
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleVerification = () => {
    const otp = '123456';

    if (form.otp === otp) return router.push('/(auth)/otp-success');
    return setError(true);
  };

  return (
    <SafeAreaView className={classes.container}>
      <Header title="OTP" />
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
      <Link className={classes.link} href="/sign-up">
        Resend OTP
      </Link>
    </SafeAreaView>
  );
};

const classes = {
  container: 'flex-1 bg-gray-100 dark:bg-gray-900 mx-5',
  title: 'text-2xl font-bold text-teal-600 mb-2',
  description: 'text-gray-500 text-md mb-8',
  phoneNumber: 'text-gray-500 font-bold',
  sendButton: 'mt-8',
  countdown: 'text-md text-center font-bold mt-6 mb-5',
  link: 'text-slate-500 underline font-medium text-center ',
};

export default OTPVerification;
