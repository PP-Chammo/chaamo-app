import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import '@/global.css';
import { ApolloProvider, default as client } from '@/utils/apollo';
import { getColor } from '@/utils/getColor';

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
