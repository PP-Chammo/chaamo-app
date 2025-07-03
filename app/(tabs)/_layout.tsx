import React from 'react';

import { Tabs } from 'expo-router';

import { Icon } from '@/components/atoms';
import { getColor } from '@/utils/getColor';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: { backgroundColor: getColor('gray-50') },
        tabBarActiveTintColor: getColor('teal-500'),
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
            <Icon size={28} name="message-outline" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="(profile)"
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
