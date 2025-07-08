import React, { memo } from 'react';

import { clsx } from 'clsx';
import { Href, useRouter, useSegments } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import { setupProfileTabs } from '@/constants/tabs';

const SetupProfileTabs = memo(function SetupProfileTabs() {
  const router = useRouter();
  const segments = useSegments();
  const activeRoute = segments[segments.length - 1];

  return (
    <View className="flex-row justify-between mt-6 mb-4 gap-8">
      {setupProfileTabs.map((tab, idx) => {
        const isActive = activeRoute === tab.route;
        const isPrevious =
          !isActive &&
          setupProfileTabs.findIndex((t) => t.route === activeRoute) - 1 >= idx;

        return (
          // for development purposes, it's should not clickable
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
  );
});

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

export default SetupProfileTabs;
