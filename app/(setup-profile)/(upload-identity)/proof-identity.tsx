import React from 'react';

import { router } from 'expo-router';
import { View } from 'react-native';

import { IDVerificationIcon } from '@/assets/svg';
import {
  Icon,
  Label,
  ProofIdentity,
  ScreenContainer,
} from '@/components/atoms';

export default function ProofIdentityScreen() {
  return (
    <ScreenContainer className={classes.container}>
      <View className="items-center justify-center my-12">
        <IDVerificationIcon className={classes.icon} />
      </View>
      <Label className={classes.title} variant="title">
        Upload proof of your identity
      </Label>
      <Label className={classes.description}>
        Please submit a document below
      </Label>
      <ProofIdentity
        title="ID Card"
        onPress={() => router.push('/')}
        icon={<Icon name="badge-account-outline" size={24} color="black" />}
      />
      <ProofIdentity
        title="Passport"
        onPress={() => router.push('/')}
        icon={
          <Icon
            name="badge-account-horizontal-outline"
            size={24}
            color="black"
          />
        }
      />
      <ProofIdentity
        title="License"
        onPress={() => router.push('/')}
        icon={<Icon name="credit-card-outline" size={24} color="black" />}
      />
    </ScreenContainer>
  );
}

const classes = {
  container: 'flex-1 gap-4 p-6',
  title: 'text-3xl font-bold text-teal-600',
  description: 'text-slate-500 font-medium text-lg mb-6',
  icon: 'w-10 h-10',
  proofIdentity:
    'flex-row items-center justify-between rounded-xl px-6 py-4 shadow',
};
