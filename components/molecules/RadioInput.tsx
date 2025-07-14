import React, { memo, useCallback } from 'react';

import { clsx } from 'clsx';
import { TouchableOpacity } from 'react-native';

import { Icon, Label } from '@/components/atoms';
import { TextChangeParams } from '@/domains';
import { getColor } from '@/utils/getColor';

interface RadioInputProps {
  label: string;
  selected: boolean;
  name: string;
  onPress: ({ name, value }: TextChangeParams) => void;
  className?: string;
  reverse?: boolean;
  keyLabel?: string;
}

const RadioInput = memo(function RadioInput({
  label,
  selected,
  onPress,
  className,
  reverse = false,
  name,
  keyLabel,
}: RadioInputProps) {
  const handlePress = useCallback(() => {
    const value = keyLabel || label;
    onPress({ name, value });
  }, [name, label, onPress, keyLabel]);

  return (
    <TouchableOpacity
      className={clsx(classes.container, className, {
        [classes.reverse]: reverse,
      })}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <Icon
        className={classes.icon}
        name={selected ? 'circle-slice-8' : 'circle-outline'}
        size={24}
        color={selected ? getColor('primary-500') : getColor('gray-400')}
      />
      <Label className={classes.label}>{label}</Label>
    </TouchableOpacity>
  );
});

const classes = {
  container: 'flex flex-row items-center gap-5',
  reverse: '!flex-row-reverse',
  label: 'flex-1',
  icon: 'self-start',
};

export default RadioInput;
