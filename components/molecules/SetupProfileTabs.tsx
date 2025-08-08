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
    <View testID="setup-profile-tabs" className={classes.container}>
      {setupProfileTabs.map((tab, idx) => {
        const isActive = activeRoute === tab.route;
        const isPrevious =
          !isActive &&
          setupProfileTabs.findIndex((t) => t.route === activeRoute) - 1 >= idx;

        const tabState = () => {
          if (!isActive && !isPrevious) {
            return 'inactive';
          } else if (isPrevious) {
            return 'previous';
          } else {
            return 'active';
          }
        };

        return (
          <Pressable
            key={tab.route}
            testID={`tab-${tab.route}`}
            className={classes.tabContainer}
            onPress={() => router.push(`/${tab.route}` as Href)}
          >
            <Text
              testID={`tab-title-${tab.route}`}
              className={clsx(classes.TabTitle[tabState()])}
            >
              {tab.title}
            </Text>
            <View
              testID={`tab-indicator-${tab.route}`}
              className={clsx(classes.TabIndicator[tabState()])}
            />
          </Pressable>
        );
      })}
    </View>
  );
});

const classes = {
  TabTitle: {
    active: 'text-primary-500 font-semibold mb-2',
    previous: 'text-primary-700/30 font-semibold mb-2',
    inactive: 'text-slate-500 font-medium mb-2',
  },
  TabIndicator: {
    active: 'w-12 h-1 bg-primary-500 rounded-full mt-2',
    previous: 'w-12 h-1 bg-primary-300 rounded-full mt-2',
    inactive: 'w-12 h-1 bg-slate-200 rounded-full mt-2',
  },
  container: 'flex-row justify-between my-4.5 gap-8',
  tabContainer: 'flex-1 items-center',
};

export default SetupProfileTabs;
