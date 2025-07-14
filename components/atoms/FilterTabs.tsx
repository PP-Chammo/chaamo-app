import { memo } from 'react';

import { clsx } from 'clsx';
import { ScrollView, Text, TouchableOpacity } from 'react-native';

export type FilterValue = number | string;

interface Tab {
  label: string;
  value: FilterValue;
}

interface FilterTabsProps {
  tabs: Tab[];
  className?: string;
  onChange: (value: FilterValue) => void;
  selected: FilterValue;
  getTabTestID?: (tab: Tab) => string | undefined;
}

const FilterTabs = memo(function FilterTabs({
  tabs,
  className,
  selected,
  onChange,
  getTabTestID,
}: FilterTabsProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerClassName={clsx(classes.container, className)}
    >
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.value}
          testID={getTabTestID ? getTabTestID(tab) : undefined}
          className={clsx({
            [classes.tabActive]: selected === tab.value,
            [classes.tab]: selected !== tab.value,
          })}
          onPress={() => onChange(tab.value as typeof selected)}
          activeOpacity={0.8}
        >
          <Text
            className={clsx({
              [classes.labelActive]: selected === tab.value,
              [classes.label]: selected !== tab.value,
            })}
          >
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
});

const classes = {
  container: 'flex-row mb-2 mt-1 gap-5 self-start',
  tab: 'px-3 py-1.5 rounded-full border border-slate-300',
  tabActive: 'px-3 py-1.5 rounded-full border border-primary-500 bg-primary-50',
  label: 'text-slate-600 text-sm',
  labelActive: 'text-primary-500 text-sm font-medium',
};

export default FilterTabs;
