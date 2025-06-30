import React from 'react';

import { clsx } from 'clsx';
import { Href, router, Slot, useSegments } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import { ScreenContainer } from '@/components/atoms';
import { Header } from '@/components/molecules';

const tabs = [
  { title: 'Personal Info.', route: 'personal-info' },
  { title: 'Address', route: 'address' },
  { title: 'ID Verification', route: 'id-verification' },
];

export default function ProfileLayout() {
  const segments = useSegments();
  const activeRoute = segments[segments.length - 1];

  return (
    <ScreenContainer className="p-6">
      <Header title="Setting Up Profile" onBackPress={() => router.back()} />
      <View className="flex-row justify-between mt-6 mb-4 gap-8">
        {tabs.map((tab, idx) => {
          const isActive = activeRoute === tab.route;
          const isPrevious =
            !isActive &&
            tabs.findIndex((t) => t.route === activeRoute) - 1 >= idx;

          return (
            <Pressable
              key={tab.route}
              className="flex-1 items-center"
              onPress={() => router.push(`/${tab.route}` as Href)}
            >
              <Text
                className={clsx(
                  classes.TabTitle[
                    !isActive && !isPrevious
                      ? 'inactive'
                      : isPrevious
                        ? 'previous'
                        : 'active'
                  ],
                )}
              >
                {tab.title}
              </Text>
              <View
                className={clsx(
                  classes.TabIndicator[
                    !isActive && !isPrevious
                      ? 'inactive'
                      : isPrevious
                        ? 'previous'
                        : 'active'
                  ],
                )}
              />
            </Pressable>
          );
        })}
      </View>
      <Slot />
    </ScreenContainer>
  );
}

const classes = {
  TabTitle: {
    active: 'text-teal-600 font-semibold mb-2',
    previous: 'text-teal-700/30 font-semibold mb-2',
    inactive: 'text-slate-500 font-medium mb-2',
  },
  TabIndicator: {
    active: 'h-1 bg-teal-500 w-full rounded-full',
    previous: 'h-1 bg-teal-500/30 w-full rounded-full',
    inactive: 'h-1 bg-slate-400 w-full rounded-full',
  },
};
