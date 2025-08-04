import { memo, useMemo } from 'react';

import { router } from 'expo-router';
import { View } from 'react-native';

import { Label, Row } from '@/components/atoms';
import { ButtonIcon } from '@/components/molecules';
import { useGetNotificationsQuery } from '@/generated/graphql';
import { useUserVar } from '@/hooks/useUserVar';

const AccountBar = memo(function AccountBar() {
  const [user] = useUserVar();
  const { data } = useGetNotificationsQuery({
    skip: !user?.id,
    variables: {
      filter: {
        user_id: { eq: user?.id },
      },
    },
  });

  const notifications = useMemo(
    () => data?.notificationsCollection?.edges ?? [],
    [data?.notificationsCollection?.edges],
  );

  const notificationCount = useMemo(() => {
    if (notifications?.length > 0) {
      return notifications?.length > 9 ? '9+' : notifications?.length;
    }
  }, [notifications?.length]);

  return (
    <Row testID="account-bar" between className={classes.container}>
      <View testID="account-bar-left" className={classes.leftSpace}>
        <Label className="text-xl">Hi</Label>
        <Label className="text-xl font-bold">
          {user?.user_metadata?.name ?? user?.email}!
        </Label>
      </View>
      <View testID="account-bar-right" className={classes.rightSpace}>
        <ButtonIcon
          name="bell"
          iconVariant="SimpleLineIcons"
          onPress={() => router.push('/screens/notifications')}
          count={notificationCount}
        />
        <ButtonIcon
          name="wallet"
          iconVariant="SimpleLineIcons"
          onPress={() => router.push('/screens/wallets')}
        />
      </View>
    </Row>
  );
});

const classes = {
  container: 'w-full px-4.5',
  leftSpace: 'flex flex-row gap-1',
  rightSpace: 'flex flex-row gap-5',
};

export default AccountBar;
