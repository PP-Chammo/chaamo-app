import React, { memo } from 'react';

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text, TouchableOpacity, View } from 'react-native';

interface ProofIdentityProps {
  title: string;
  onPress: () => void;
  icon: React.ReactNode;
}

const ProofIdentity: React.FC<ProofIdentityProps> = memo(
  function ProofIdentity({ title, onPress, icon }) {
    return (
      <TouchableOpacity className={classes.container} onPress={onPress}>
        <View className={classes.content}>
          {icon}
          <Text>{title}</Text>
        </View>
        <MaterialCommunityIcons name="chevron-right" size={24} color="black" />
      </TouchableOpacity>
    );
  },
);

const classes = {
  container: 'flex-row items-center justify-between rounded-xl py-4 shadow',
  content: 'flex-row items-center gap-6',
};

export default ProofIdentity;
