import React, { memo } from 'react';

import { Switch } from 'react-native';

import { Row, Label } from '@/components/atoms';
import { getColor } from '@/utils/getColor';

interface SwitchInputProps {
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
}

const SwitchInput: React.FC<SwitchInputProps> = memo(function SwitchInput({
  label,
  value,
  onValueChange,
  disabled,
}: SwitchInputProps) {
  return (
    <Row between className={classes.container}>
      <Label className={classes.label}>{label}</Label>
      <Switch
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
        trackColor={{
          true: getColor('primary-500'),
          false: getColor('gray-200'),
        }}
        thumbColor={value ? getColor('white') : getColor('gray-600')}
      />
    </Row>
  );
});

export default SwitchInput;

const classes = {
  container: 'px-4 py-2 items-center',
  label: 'text-base text-slate-700',
};
