import { memo, useCallback } from 'react';

import { clsx } from 'clsx';
import { Link } from 'expo-router';
import { cssInterop } from 'nativewind';
import { ScrollView, View } from 'react-native';

import { Icon, Label, Row } from '@/components/atoms';

interface GroupWithLinkProps {
  title: string;
  titleLink?: string;
  onViewAllHref?: React.ComponentProps<typeof Link>['href'];
  onPress?: () => void;
  children: React.ReactNode;
  iconName?: string;
  iconColor?: string;
  iconSize?: number;
  className?: string;
  headerClassName?: string;
  noLink?: boolean;
}

cssInterop(ScrollView, {
  contentContainerClassName: {
    target: 'contentContainerStyle',
  },
});

const GroupWithLink: React.FC<GroupWithLinkProps> = memo(
  function GroupWithLink({
    title,
    titleLink = 'View all',
    onViewAllHref,
    onPress,
    children,
    iconName,
    iconColor = 'black',
    iconSize = 24,
    className,
    headerClassName,
    noLink = false,
  }) {
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
      <View className={className}>
        <Row between className={clsx(classes.headerContainer, headerClassName)}>
          <View className={classes.titleContainer}>
            <Label className={classes.title}>{title}</Label>
            {iconName && (
              <Icon name={iconName} color={iconColor} size={iconSize} />
            )}
          </View>
          {!noLink && renderLink()}
        </Row>
        <View className={classes.container}>{children}</View>
      </View>
    );
  },
);

const classes = {
  headerContainer: 'px-4.5',
  titleContainer: 'flex flex-row items-center gap-2',
  title: 'font-semibold',
  viewAllText: 'text-teal-500 font-semibold',
  container: 'flex flex-row gap-5',
};

export default GroupWithLink;
