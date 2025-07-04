import React, { memo } from 'react';

import { clsx } from 'clsx';
import { Href, useRouter, useSegments } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import { profileTabs } from '@/constants/profiles';

interface ProfileTabsProps {
  className?: string;
}

const ProfileTabs: React.FC<ProfileTabsProps> = memo(function ProfileTabs({
  className,
}) {
  const router = useRouter();
  const segments = useSegments();
  const activeRoute = segments[segments.length - 1];

  return (
    <View className={clsx(classes.container, className)}>
      {profileTabs.map((tab) => {
        const isActive = activeRoute === tab.route;

        return (
          <Pressable
            key={tab.route}
            className="flex-1 items-center"
            onPress={() => router.push(`/${tab.route}` as Href)}
          >
            <Text
              className={clsx(
                classes.tabTitle[isActive ? 'active' : 'inactive'],
              )}
            >
              {tab.title}
            </Text>
            <View
              className={clsx(
                classes.tabIndicator[isActive ? 'active' : 'inactive'],
              )}
            />
          </Pressable>
        );
      })}
    </View>
  );
});

const classes = {
  container: 'flex-row justify-between border-b border-slate-200',
  tabTitle: {
    active: 'text-slate-800 font-semibold mb-2',
    inactive: 'text-slate-500 font-medium mb-2',
  },
  tabIndicator: {
    active: 'h-1 bg-teal-500 w-full rounded-full',
    inactive: 'h-1',
  },
};

export default ProfileTabs;
