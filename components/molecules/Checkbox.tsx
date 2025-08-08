import React, { memo } from 'react';

import { clsx } from 'clsx';
import { Pressable, View } from 'react-native';

import { Icon, Label } from '@/components/atoms';
import { BooleanChangeParams } from '@/domains';
import { getColor } from '@/utils/getColor';

interface CheckboxProps {
  label?: string;
  checked: boolean;
  onChange: ({ name, value }: BooleanChangeParams) => void;
  disabled?: boolean;
  name: string;
  children?: React.ReactNode;
  className?: string;
  testID?: string;
}

const Checkbox: React.FC<CheckboxProps> = memo(function Checkbox({
  label,
  checked,
  onChange,
  disabled = false,
  name,
  children,
  className,
  testID,
}) {
  return (
    <Pressable
      testID={testID}
      className={clsx(classes.container, className)}
      onPress={() => !disabled && onChange({ name, value: !checked })}
      disabled={disabled}
      accessibilityRole="checkbox"
      accessibilityState={{ checked, disabled }}
    >
      <View
        className={clsx(
          classes.checkbox,
          checked && classes.checked,
          disabled && classes.disabled,
        )}
      >
        {checked && (
          <Icon name="check-bold" size={16} color={getColor('primary-500')} />
        )}
      </View>
      {label && <Label className={classes.label}>{label}</Label>}
      {children}
    </Pressable>
  );
});

const classes = {
  container: 'flex-row items-center gap-2',
  checkbox:
    'w-5 h-5 rounded border border-slate-300 flex items-center justify-center bg-white',
  checked: 'bg-primary-500 border-primary-500',
  disabled: 'opacity-50',
  label: 'text-slate-500 font-medium text-md',
};
export default Checkbox;
