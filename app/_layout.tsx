import 'react-native-url-polyfill/auto'; // this needed for supabase to be worked on react-native , dont remove it

import { ApolloProvider } from '@apollo/client';
import * as Sentry from '@sentry/react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { KeyboardProvider } from 'react-native-keyboard-controller';

import { default as client } from '@/utils/apollo';
import { getColor } from '@/utils/getColor';

import '@/global.css';

const env = process.env.EXPO_PUBLIC_ENVIRONMENT || 'development';

Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
  environment: env,
  enableAutoSessionTracking: true,
  tracesSampleRate: 0.1,
});

function RootLayout() {
  return (
    <ApolloProvider client={client}>
      <KeyboardProvider>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: getColor('white') },
          }}
        >
          <Stack.Screen name="index" />
        </Stack>
      </KeyboardProvider>
      <StatusBar style="auto" />
    </ApolloProvider>
  );
}

export default Sentry.wrap(RootLayout);
