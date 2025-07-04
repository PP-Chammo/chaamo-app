import { memo } from 'react';

import { clsx } from 'clsx';
import { View } from 'react-native';

interface DividerProps {
  position?: 'horizontal' | 'vertical';
  className?: string;
}

const Divider = memo(function Divider({
  position = 'vertical',
  className,
}: DividerProps) {
  return <View className={clsx(classes[position], className)} />;
});

const classes = {
  vertical: 'h-full w-px bg-slate-300',
  horizontal: 'h-px w-full bg-slate-300',
};

export default Divider;
