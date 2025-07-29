import { memo, useMemo } from 'react';

import { router } from 'expo-router';
import { View } from 'react-native';

import { Label, Row } from '@/components/atoms';
import { ButtonIcon } from '@/components/molecules';
import { useGetNotificationsQuery } from '@/generated/graphql';
import { useProfileVar } from '@/hooks/useProfileVar';

const AccountBar = memo(function AccountBar() {
  const [profile] = useProfileVar();
  const { data } = useGetNotificationsQuery({
    variables: {
      filter: {
        id: { eq: profile?.id },
      },
    },
  });
  const notifications = data?.notificationsCollection?.edges ?? [];

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
          {profile?.user_metadata?.name ?? profile?.email}!
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
