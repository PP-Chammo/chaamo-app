import React, { memo, useCallback, useRef, useState } from 'react';

import { clsx } from 'clsx';
import { cssInterop } from 'nativewind';
import { Pressable, Text, View } from 'react-native';
import PagerView, {
  PagerViewOnPageSelectedEvent,
} from 'react-native-pager-view';

import { Icon, Row } from '@/components/atoms';

cssInterop(PagerView, {
  className: {
    target: 'style',
  },
});

interface TabViewProps {
  className?: string;
  contentClassName?: string;
  initialPage?: number;
  tabs: (string | Tab)[];
  children: React.ReactNode;
}

type Tab = {
  title: string;
  icon?: string;
  iconColor?: string;
  iconSize?: number;
};

const TabView: React.FC<TabViewProps> = memo(function TabView({
  className,
  contentClassName,
  initialPage = 0,
  tabs,
  children,
}) {
  const [activeTab, setActiveTab] = useState(initialPage);
  const pagerRef = useRef<PagerView>(null);

  const handleTabPress = useCallback((index: number) => {
    setActiveTab(index);
    pagerRef.current?.setPage(index);
  }, []);

  const handlePageChange = useCallback(
    (event: PagerViewOnPageSelectedEvent) => {
      const page = event.nativeEvent.position;
      setActiveTab(page);
    },
    [],
  );

  return (
    <View className={classes.container}>
      <View className={clsx(classes.tabscontainer, className)}>
        {tabs.map((tab, index) => {
          const isActive = activeTab === index;

          const tabTitle = typeof tab === 'string' ? tab : tab.title;

          return (
            <Pressable
              key={tabTitle}
              className="flex-1 items-center"
              onPress={() => handleTabPress(index)}
            >
              <Row className={classes.tabRow}>
                <Text
                  className={clsx(
                    classes.tabTitle[isActive ? 'active' : 'inactive'],
                  )}
                >
                  {tabTitle}
                </Text>
                {typeof tab === 'object' && tab?.icon && (
                  <Icon
                    name={tab.icon}
                    color={tab.iconColor}
                    size={tab.iconSize}
                  />
                )}
              </Row>
              <View
                className={clsx(
                  classes.tabIndicator[isActive ? 'active' : 'inactive'],
                )}
              />
            </Pressable>
          );
        })}
      </View>
      <PagerView
        ref={pagerRef}
        className={clsx(classes.pagerView, contentClassName)}
        initialPage={initialPage}
        onPageSelected={handlePageChange}
      >
        {children}
      </PagerView>
    </View>
  );
});

const classes = {
  container: 'flex-1',
  tabscontainer: 'flex-row justify-between border-b border-slate-200',
  tabRow: 'py-2',
  tabTitle: {
    active: 'text-slate-800 font-semibold',
    inactive: 'text-slate-500 font-medium',
  },
  tabIndicator: {
    active: 'h-0.5 bg-teal-500 w-full rounded-full',
    inactive: 'h-0.5',
  },
  pagerView: 'flex-1',
};

export default TabView;
