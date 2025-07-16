import { Fragment } from 'react';

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import '@/global.css';
import { getColor } from '@/utils/getColor';

export default function RootLayout() {
  return (
    <Fragment>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: getColor('white') },
        }}
      >
        <Stack.Screen name="index" />
      </Stack>
      <StatusBar style="auto" />
    </Fragment>
  );
}
