import React, { memo, useMemo, useState } from 'react';

import { clsx } from 'clsx';
import * as shape from 'd3-shape';
import { cssInterop } from 'nativewind';
import { TouchableOpacity, View } from 'react-native';
import { Defs, Line, LinearGradient, Stop } from 'react-native-svg';
import { AreaChart } from 'react-native-svg-charts';

import { FilterTabs, FilterValue, Label } from '@/components/atoms';
import { PERIODS_TABS_FILTER } from '@/constants/tabs';
import { getColor } from '@/utils/getColor';

cssInterop(AreaChart, {
  className: {
    target: 'style',
  },
});

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

interface ChartProps {
  data: {
    raw: { [key: number]: number[] };
    graded: { [key: number]: number[] };
  };
}

const CHART_HEIGHT = 142;

const Chart = memo(function Chart({ data }: ChartProps) {
  const [selectedTab, setSelectedTab] = useState<string>('Raw');
  const [selectedPeriod, setSelectedPeriod] = useState<FilterValue>(7);

  const chartData =
    data[selectedTab.toLowerCase() as 'raw' | 'graded'][
      Number(selectedPeriod)
    ] || [];
  const best = chartData.length ? Math.max(...chartData) : 0;
  const today = chartData.length ? chartData[chartData.length - 1] : 0;

  const gridLines = useMemo(() => {
    const lines = {
      [7]: Array.from({ length: 7 }, (_, i) => i),
      [14]: Array.from({ length: 14 }, (_, i) => i),
      [30]: Array.from({ length: 30 }, (_, i) => i),
      [90]: Array.from({ length: 90 }, (_, i) => i),
    } as const;

    return lines[selectedPeriod as keyof typeof lines];
  }, [selectedPeriod]);

  let xLabels: { label: string; date: string | number }[] = [];
  if (selectedPeriod === 7) {
    xLabels = DAY_LABELS.map((label, i) => ({ label, date: i + 10 }));
  } else {
    const total = chartData.length;
    const numLabels = 7;
    xLabels = Array.from({ length: numLabels }, (_, i) => {
      const idx = Math.round((i / (numLabels - 1)) * (total - 1));
      return { label: '', date: idx + 1 };
    });
  }

  return (
    <View testID="chart" className={classes.card}>
      <View className={classes.tabContainer}>
        <TouchableOpacity
          testID="raw-tab"
          className={clsx({
            [classes.tabActive]: selectedTab === 'Raw',
            [classes.tab]: selectedTab !== 'Raw',
          })}
          onPress={() => setSelectedTab('Raw')}
          activeOpacity={0.8}
        >
          <Label
            className={
              selectedTab === 'Raw' ? classes.tabLabelActive : classes.tabLabel
            }
          >
            Raw
          </Label>
        </TouchableOpacity>
        <TouchableOpacity
          testID="graded-tab"
          className={clsx({
            [classes.tabActive]: selectedTab === 'Graded',
            [classes.tab]: selectedTab !== 'Graded',
          })}
          onPress={() => setSelectedTab('Graded')}
          activeOpacity={0.8}
        >
          <Label
            className={
              selectedTab === 'Graded'
                ? classes.tabLabelActive
                : classes.tabLabel
            }
          >
            Graded
          </Label>
        </TouchableOpacity>
      </View>
      <FilterTabs
        tabs={PERIODS_TABS_FILTER}
        selected={selectedPeriod}
        onChange={setSelectedPeriod}
        getTabTestID={(tab) => `period-${tab.value}`}
      />
      <View className={classes.chartContainer} testID="chart-container">
        <View className={classes.xAxisContainer} pointerEvents="none">
          {xLabels.map((d, i) => (
            <View
              key={`${d.label}-${i}`}
              className={classes.xAxisLabelContainer}
            >
              <Label className={classes.xAxisLabel}>{d.label}</Label>
              <Label className={classes.xAxisDate}>{d.date}</Label>
              {selectedPeriod === 7 && i === 4 && (
                <View className={classes.dot} />
              )}
            </View>
          ))}
        </View>
        <View className={classes.areaChartContainer}>
          <AreaChart
            testID="area-chart"
            style={{ height: CHART_HEIGHT }}
            className={classes.chart}
            data={chartData}
            contentInset={{ top: 10, bottom: 0, left: 0, right: 0 }}
            curve={shape.curveMonotoneX}
            svg={{ fill: 'url(#chartGradient)' }}
          >
            {gridLines.map((i) => (
              <Line
                key={i}
                x1={`${(i / (gridLines.length - 1)) * 100}%`}
                x2={`${(i / (gridLines.length - 1)) * 100}%`}
                y1={0}
                y2={CHART_HEIGHT}
                stroke={
                  selectedPeriod === 7 && i === 4
                    ? getColor('teal-600')
                    : getColor('gray-300')
                }
                strokeWidth={1}
                opacity={0.35}
              />
            ))}
            <Defs key={'gradient'}>
              <LinearGradient id="chartGradient" x1="0" y1="1" x2="0" y2="0">
                <Stop
                  offset="100%"
                  stopColor={getColor('teal-500')}
                  stopOpacity={0.6}
                />
                <Stop
                  offset="0%"
                  stopColor={getColor('teal-50')}
                  stopOpacity={0.0}
                />
              </LinearGradient>
            </Defs>
          </AreaChart>
        </View>
      </View>
      <View testID="stats-container" className={classes.statsContainer}>
        <View className={classes.statItem}>
          <Label className={classes.statLabel}>Best</Label>
          <Label className={classes.statLabelBolder}>Today</Label>
        </View>
        <View className={classes.statItem}>
          <Label className={classes.statValue} testID="best-value">
            ${best.toFixed(2)}
          </Label>
          <Label className={classes.statValueBolder} testID="today-value">
            ${today.toFixed(2)}
          </Label>
        </View>
      </View>
    </View>
  );
});

export default Chart;

const classes = {
  card: 'bg-white rounded-2xl p-4.5 shadow-sm border border-slate-200',
  tabContainer: 'flex-row border border-teal-100 rounded-full p-0.5 mb-3 mt-1',
  tab: 'flex-1 items-center py-2 rounded-full bg-white',
  tabLeft: 'flex-1 items-center py-2 rounded-full mr-2',
  tabRight: 'flex-1 items-center py-2 rounded-full ml-2',
  tabActive: 'flex-1 items-center py-2 rounded-full bg-teal-600',
  tabLabel: '!text-gray-800',
  tabLabelActive: 'text-white',
  periodContainer: 'flex-row justify-between mb-2 mt-1',
  period: 'px-3 py-1.5 rounded-full border border-slate-300',
  periodActive: 'px-3 py-1.5 rounded-full border border-teal-500 bg-teal-50',
  periodLabel: 'text-slate-600 text-xs',
  periodLabelActive: 'text-teal-600 text-xs font-medium',
  chartContainer: 'w-full relative mb-2',
  xAxisContainer:
    'absolute left-0 right-0 top-2 flex-row justify-between px-[-10px]',
  xAxisLabelContainer: 'items-center w-8',
  xAxisLabel: 'text-xs text-slate-400 font-semibold',
  xAxisDate: 'text-xs text-slate-800 font-semibold',
  dot: 'w-1.5 h-1.5 rounded-full bg-teal-600/80 mt-1.5',
  statsContainer: 'flex-row justify-between mt-3',
  statItem: 'gap-3',
  statLabel: 'text-xs text-slate-700',
  statLabelBolder: 'text-xs text-slate-900 font-medium',
  statValue: 'text-xs font-semibold text-slate-700 text-right',
  statValueBolder: 'text-xs font-bold text-slate-900 text-right',
  chart: 'mt-16 w-full',
  areaChartContainer: 'px-3.5 border-b border-teal-600',
};
