import { memo, useCallback } from 'react';

import { clsx } from 'clsx';
import { Link } from 'expo-router';
import { cssInterop } from 'nativewind';
import { FlatList, ScrollView, View } from 'react-native';

import { Icon, Label, Row } from '@/components/atoms';

export type ListContainerProps<T> = {
  title: string;
  listDirection?: ListContainerDirection;
  titleLink?: string;
  onViewAllHref?: React.ComponentProps<typeof Link>['href'];
  onPress?: () => void;
  icon?: string;
  iconColor?: string;
  iconSize?: number;
  className?: string;
  headerClassName?: string;
  contentContainerClassName?: string;
  noLink?: boolean;
  data: Record<keyof T, T[keyof T]>[];
  children: (item: T, index: number) => React.ReactNode;
};

export enum ListContainerDirection {
  Horizontal = 'horizontal',
  Vertical = 'vertical',
  None = 'none',
}

cssInterop(ScrollView, {
  contentContainerClassName: {
    target: 'contentContainerStyle',
  },
});

function ListContainer<T>({
  title,
  listDirection = ListContainerDirection.Horizontal,
  titleLink = 'View all',
  onViewAllHref,
  onPress,
  icon,
  iconColor = 'black',
  iconSize = 20,
  className,
  headerClassName,
  contentContainerClassName,
  noLink = false,
  data,
  children,
}: Readonly<ListContainerProps<T>>) {
  const renderLink = useCallback(
    () =>
      onViewAllHref ? (
        <Link href={onViewAllHref} className={classes.viewAllText}>
          {titleLink}
        </Link>
      ) : (
        <Label className={classes.viewAllText} onPress={onPress}>
          {titleLink}
        </Label>
      ),
    [onPress, onViewAllHref, titleLink],
  );

  return (
    <View className={clsx(classes.container, className)}>
      <Row between className={clsx(classes.headerContainer, headerClassName)}>
        <View className={classes.titleContainer}>
          <Label className={classes.title}>{title}</Label>
          {icon && <Icon name={icon} color={iconColor} size={iconSize} />}
        </View>
        {!noLink && renderLink()}
      </Row>
      {listDirection === ListContainerDirection.None ? (
        <View
          className={clsx(
            classes.contentContainerVertical,
            contentContainerClassName,
          )}
        >
          {data.map((item, index) => children(item as T, index))}
        </View>
      ) : (
        <FlatList
          data={data as T[]}
          renderItem={({ item, index }: { item: T; index: number }) =>
            children(item, index) as React.ReactElement | null
          }
          horizontal={listDirection === ListContainerDirection.Horizontal}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          contentContainerClassName={clsx(
            classes.contentContainerHorizontal,
            contentContainerClassName,
          )}
        />
      )}
    </View>
  );
}

const classes = {
  container: 'flex-1',
  headerContainer: 'px-4.5',
  titleContainer: 'flex flex-row items-center gap-2',
  title: 'text-[15px] font-semibold',
  viewAllText: 'text-teal-600 font-semibold',
  contentContainerVertical: 'flex-1 gap-5 px-4.5 py-4',
  contentContainerHorizontal: 'gap-5 px-4.5 py-4',
};

export default memo(ListContainer) as typeof ListContainer;
