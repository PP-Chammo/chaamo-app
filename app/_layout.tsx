import 'react-native-url-polyfill/auto'; // this needed for supabase to be worked on react-native , dont remove it

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { ApolloProvider, default as client } from '@/utils/apollo';
import { getColor } from '@/utils/getColor';

import '@/global.css';

export default function RootLayout() {
  return (
    <ApolloProvider client={client}>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: getColor('white') },
        }}
      >
        <Stack.Screen name="index" />
      </Stack>
      <StatusBar style="auto" />
    </ApolloProvider>
  );
}
