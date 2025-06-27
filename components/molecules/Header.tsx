import React, { memo } from 'react';

import { useNavigation } from '@react-navigation/native';
import { Text, TouchableOpacity, View } from 'react-native';

import { Icon } from '@/components/atoms';

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = memo(function Header({ title }) {
  const navigation = useNavigation();

  return (
    <View className={classes.header}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        className={classes.backButton}
      >
        <Icon name="arrow-left" size={24} color="#222" />
      </TouchableOpacity>
      <Text className={classes.title}>{title}</Text>
      <View className={classes.rightSpace} />
    </View>
  );
});

const classes = {
  header:
    'flex-row items-center h-[64] bg-transparent border-b-0 justify-between',
  backButton: 'w-10 items-start justify-center',
  title: 'flex-1 text-center text-lg font-medium text-gray-800',
  rightSpace: 'w-10',
};

export default Header;
