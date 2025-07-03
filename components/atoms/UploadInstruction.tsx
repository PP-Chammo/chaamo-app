import { memo } from 'react';

import { clsx } from 'clsx';
import { Text, View } from 'react-native';

interface UploadInstructionProps {
  className?: string;
  variant?: 'light' | 'dark';
}

const UploadInstruction: React.FC<UploadInstructionProps> = memo(
  function UploadInstruction({ className, variant = 'dark' }) {
    return (
      <View className={clsx(classes.container, className)}>
        <Text
          className={clsx(classes.instructionTitle, classes.variant[variant])}
        >
          Instructions
        </Text>
        <Text
          className={clsx(classes.instructionText, classes.variant[variant])}
        >
          1. Upload clear and valid documents.
        </Text>
        <Text
          className={clsx(classes.instructionText, classes.variant[variant])}
        >
          2. Ensure details match your info.
        </Text>
        <Text
          className={clsx(classes.instructionText, classes.variant[variant])}
        >
          3. Avoid expired or blurry files.
        </Text>
      </View>
    );
  },
);

const classes = {
  container: 'gap-1',
  instructionTitle: 'font-bold mb-2 text-base',
  instructionText: 'text-sm mb-1',
  variant: {
    light: 'text-slate-600',
    dark: 'text-white',
  },
};

export default UploadInstruction;
