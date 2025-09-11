import React, { memo, useCallback } from 'react';

import { clsx } from 'clsx';
import { TouchableOpacity, View } from 'react-native';

import { Icon, Label } from '@/components/atoms';
import { TextChangeParams } from '@/domains';
import { getColor } from '@/utils/getColor';

interface RadioInputProps {
  label: string;
  sublabel?: string;
  selected: boolean;
  name: string;
  onPress: ({ name, value }: TextChangeParams) => void;
  className?: string;
  classNameLabel?: string;
  classNameSublabel?: string;
  reverse?: boolean;
  keyLabel?: string;
  value?: string;
  toggle?: boolean;
}

const RadioInput = memo(function RadioInput({
  label,
  sublabel,
  selected,
  onPress,
  className,
  classNameLabel,
  classNameSublabel,
  reverse = false,
  name,
  keyLabel,
  value,
  toggle = false,
}: RadioInputProps) {
  const handlePress = useCallback(() => {
    const internalValue = keyLabel || label;
    if (toggle) {
      const toggleValue = internalValue === value ? '' : internalValue;
      onPress({ name, value: toggleValue });
    } else {
      onPress({ name, value: internalValue });
    }
  }, [keyLabel, label, toggle, value, onPress, name]);

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
      <View className={classes.labels}>
        <Label className={clsx(classes.label, classNameLabel)}>{label}</Label>
        {sublabel && (
          <Label className={clsx(classes.sublabel, classNameSublabel)}>
            {sublabel}
          </Label>
        )}
      </View>
    </TouchableOpacity>
  );
});

const classes = {
  container: 'flex flex-row items-center gap-4',
  reverse: '!flex-row-reverse',
  labels: 'flex-1 flex flex-row justify-between items-center',
  label: 'flex-1',
  sublabel: 'self-end',
  icon: 'self-start',
};

export default RadioInput;
