import { memo } from 'react';

import { router } from 'expo-router';
import { View } from 'react-native';

import { Label, Row } from '@/components/atoms';
import { ButtonIcon } from '@/components/molecules';

const AccountBar = memo(function AccountBar() {
  return (
    <Row testID="account-bar" between className={classes.container}>
      <View testID="account-bar-left" className={classes.leftSpace}>
        <Label className="text-xl">👋 Hi</Label>
        <Label className="text-xl font-bold">Shireen!</Label>
      </View>
      <View testID="account-bar-right" className={classes.rightSpace}>
        <ButtonIcon
          name="bell"
          iconVariant="SimpleLineIcons"
          onPress={() => router.push('/screens/notifications')}
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
