import { memo } from 'react';

import { View } from 'react-native';

import { Label, Row } from '@/components/atoms';
import { ButtonIcon } from '@/components/molecules';

const AccountBar = memo(function AccountBar() {
  return (
    <Row between className={classes.container}>
      <View className={classes.leftSpace}>
        <Label className="text-xl">👋 Hi</Label>
        <Label className="text-xl font-bold">Shireen!</Label>
      </View>
      <View className={classes.rightSpace}>
        <ButtonIcon
          name="bell"
          iconVariant="SimpleLineIcons"
          onPress={() => {}}
        />
        <ButtonIcon
          name="wallet"
          iconVariant="SimpleLineIcons"
          onPress={() => {}}
        />
      </View>
    </Row>
  );
});

const classes = {
  container: 'w-full px-5',
  leftSpace: 'flex flex-row gap-1',
  rightSpace: 'flex flex-row gap-5',
};

export default AccountBar;
