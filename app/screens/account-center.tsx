import React from 'react';

import { router } from 'expo-router';
import { TouchableOpacity, View } from 'react-native';

import { Divider, Icon, Label, Row, ScreenContainer } from '@/components/atoms';
import { Header } from '@/components/molecules';
import { getColor } from '@/utils/getColor';

export default function AccountCenter() {
  return (
    <ScreenContainer>
      <Header title="Account Center" onBackPress={() => router.back()} />
      <View className={classes.container}>
        <TouchableOpacity
          onPress={() => router.push('/screens/change-password')}
        >
          <Row between className={classes.row}>
            <Label>Change Password</Label>
            <Icon
              name="chevron-right"
              size={24}
              color={getColor('slate-700')}
            />
          </Row>
        </TouchableOpacity>
        <Divider position="horizontal" />
        <TouchableOpacity
          onPress={() => router.push('/screens/personal-details')}
        >
          <Row between className={classes.row}>
            <Label>Personal Details</Label>
            <Icon
              name="chevron-right"
              size={24}
              color={getColor('slate-700')}
            />
          </Row>
        </TouchableOpacity>
      </View>
    </ScreenContainer>
  );
}

const classes = {
  container: 'bg-white shadow-lg',
  row: 'p-4.5',
};
