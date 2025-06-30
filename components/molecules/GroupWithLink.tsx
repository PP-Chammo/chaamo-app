import { memo } from 'react';

import { Link } from 'expo-router';
import { cssInterop } from 'nativewind';
import { ScrollView, View } from 'react-native';

import { Icon, Label, Row } from '@/components/atoms';

interface GroupWithLinkProps {
  title: string;
  onViewAllHref: React.ComponentProps<typeof Link>['href'];
  children: React.ReactNode;
  iconName?: string;
  iconColor?: string;
  iconSize?: number;
  className?: string;
}

cssInterop(ScrollView, {
  contentContainerClassName: {
    target: 'contentContainerStyle',
  },
});

const GroupWithLink: React.FC<GroupWithLinkProps> = memo(
  function GroupWithLink({
    title,
    onViewAllHref,
    children,
    iconName,
    iconColor = 'black',
    iconSize = 24,
    className,
  }) {
    return (
      <View className={className}>
        <Row between className={classes.headerContainer}>
          <View className={classes.titleContainer}>
            <Label variant="subtitle">{title}</Label>
            {iconName && (
              <Icon name={iconName} color={iconColor} size={iconSize} />
            )}
          </View>
          <Link href={onViewAllHref} className={classes.viewAllText}>
            View all
          </Link>
        </Row>
        <View className={classes.container}>{children}</View>
      </View>
    );
  },
);

const classes = {
  headerContainer: 'px-5 pt-5',
  titleContainer: 'flex flex-row items-center gap-2',
  viewAllText: 'text-teal-500 font-bold',
  container: 'flex flex-row gap-5',
};

export default GroupWithLink;
