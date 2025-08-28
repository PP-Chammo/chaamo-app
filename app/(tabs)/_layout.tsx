import React, { useCallback, useMemo } from 'react';

import { Tabs, useFocusEffect } from 'expo-router';
import { View } from 'react-native';

import { Icon, Label } from '@/components/atoms';
import { useGetVwMyConversationsLazyQuery } from '@/generated/graphql';
import { getColor } from '@/utils/getColor';

export default function TabLayout() {
  const [getVwMyConversations, { data }] = useGetVwMyConversationsLazyQuery({
    fetchPolicy: 'cache-and-network',
  });

  const conversations = useMemo(
    () => data?.vw_myconversationsCollection?.edges ?? [],
    [data],
  );

  const unreadTotal = useMemo(() => {
    return conversations.reduce((sum, edge) => {
      const c = edge?.node?.unread_count ?? 0;
      return sum + (typeof c === 'number' ? c : 0);
    }, 0);
  }, [conversations]);

  const unreadTotalText = unreadTotal > 99 ? '99+' : `${unreadTotal}`;

  useFocusEffect(
    useCallback(() => {
      getVwMyConversations();
    }, [getVwMyConversations]),
  );

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: getColor('white'),
        },
        tabBarActiveTintColor: getColor('primary-500'),
        tabBarInactiveTintColor: getColor('gray-400'),
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Icon size={28} name="home-variant-outline" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="community"
        options={{
          title: 'Community',
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Icon size={28} name="account-group-outline" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="sell"
        options={{
          title: 'Sell',
          href: '/screens/sell',
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Icon size={28} name="crop-free" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="inbox"
        options={{
          title: 'Inbox',
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <View className="relative">
              <Icon size={28} name="message-outline" color={color} />
              {!!unreadTotal && (
                <View className="absolute -top-1 -right-1 w-6 h-6 px-1 bg-red-500 rounded-full flex items-center justify-center">
                  <Label className="text-sm text-white">
                    {unreadTotalText}
                  </Label>
                </View>
              )}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Icon size={28} name="account-circle-outline" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
