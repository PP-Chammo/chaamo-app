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
        name="explore"
        options={{
          title: 'Explore',
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Icon size={28} name="airballoon-outline" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Icon size={28} name="account" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
