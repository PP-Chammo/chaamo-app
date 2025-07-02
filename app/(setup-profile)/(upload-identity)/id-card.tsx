import React from 'react';

import { router } from 'expo-router';

import { Label, ScreenContainer } from '@/components/atoms';
import { Header } from '@/components/molecules';

export default function IDCardScreen() {
  return (
    <ScreenContainer className={classes.container}>
      <Header title="Upload ID card" onBackPress={() => router.back()} />
      <Label>Photo ID Card Screen</Label>
    </ScreenContainer>
  );
}

const classes = {
  container: 'p-6',
  image: 'w-full h-full',
};
