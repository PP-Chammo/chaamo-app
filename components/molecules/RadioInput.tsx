import React, { memo } from 'react';

import { TouchableOpacity } from 'react-native';

import { Icon, Label } from '@/components/atoms';
import { getColor } from '@/utils/getColor';

interface RadioInputProps {
  label: string;
  selected: boolean;
  onPress: () => void;
  className?: string;
}

const RadioInput = memo(function RadioInput({
  label,
  selected,
  onPress,
  className,
}: RadioInputProps) {
  return (
    <TouchableOpacity
      className={[classes.container, className].filter(Boolean).join(' ')}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Icon
        name={selected ? 'circle-slice-8' : 'circle-outline'}
        size={24}
        color={selected ? getColor('teal-600') : getColor('gray-400')}
      />
      <Label>{label}</Label>
    </TouchableOpacity>
  );
});

const classes = {
  container: 'flex flex-row items-center gap-5',
};

export default RadioInput;
