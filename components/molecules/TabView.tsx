import React, { memo, useCallback, useRef, useState } from 'react';

import { clsx } from 'clsx';
import { cssInterop } from 'nativewind';
import { Pressable, Text, View } from 'react-native';
import PagerView, {
  PagerViewOnPageSelectedEvent,
} from 'react-native-pager-view';

cssInterop(PagerView, {
  className: {
    target: 'style',
  },
});

interface TabViewProps {
  className?: string;
  contentClassName?: string;
  initialPage?: number;
  tabs: string[];
  children: React.ReactNode;
}

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
    <View className={clsx(classes.container, className)}>
      <View className={classes.tabscontainer}>
        {tabs.map((tab, index) => {
          const isActive = activeTab === index;

          return (
            <Pressable
              key={tab}
              className="flex-1 items-center"
              onPress={() => handleTabPress(index)}
            >
              <Text
                className={clsx(
                  classes.tabTitle[isActive ? 'active' : 'inactive'],
                )}
              >
                {tab}
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
  tabTitle: {
    active: 'text-slate-800 font-semibold mb-2',
    inactive: 'text-slate-500 font-medium mb-2',
  },
  tabIndicator: {
    active: 'h-0.5 bg-teal-500 w-full rounded-full',
    inactive: 'h-0.5',
  },
  pagerView: 'flex-1',
};

export default TabView;
