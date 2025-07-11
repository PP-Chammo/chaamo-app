import { memo } from 'react';

import { clsx } from 'clsx';
import { ScrollView, Text, TouchableOpacity } from 'react-native';

type FilterValue = string | number;

interface Tab {
  label: string;
  value: FilterValue;
}

interface FilterTabsProps {
  tabs: Tab[];
  className?: string;
  onChange: (value: FilterValue) => void;
  selected: FilterValue;
}

const FilterTabs = memo(function FilterTabs({
  tabs,
  className,
  selected,
  onChange,
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
          className={clsx({
            [classes.tabActive]: selected === tab.value,
            [classes.tab]: selected !== tab.value,
          })}
          onPress={() => onChange(tab.value)}
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
  tabActive: 'px-3 py-1.5 rounded-full border border-teal-500 bg-teal-50',
  label: 'text-slate-600 text-sm',
  labelActive: 'text-teal-600 text-sm font-medium',
};

export default FilterTabs;
