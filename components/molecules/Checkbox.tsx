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
}

const Checkbox: React.FC<CheckboxProps> = memo(function Checkbox({
  label,
  checked,
  onChange,
  disabled = false,
  name,
  children,
  className,
}) {
  return (
    <Pressable
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
          <Icon name="check-bold" size={16} color={getColor('teal-600')} />
        )}
      </View>
      {label && (
        <Label className="Label-slate-500 font-medium text-md">{label}</Label>
      )}
      {children}
    </Pressable>
  );
});

const classes = {
  container: 'flex-row items-center gap-2',
  checkbox:
    'w-5 h-5 rounded border border-slate-300 flex items-center justify-center bg-white',
  checked: 'bg-teal-500 border-teal-500',
  disabled: 'opacity-50',
};
export default Checkbox;
