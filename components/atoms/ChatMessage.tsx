import { memo } from 'react';

import { clsx } from 'clsx';
import { Text, View } from 'react-native';

interface ChatMessageProps {
  message: string;
  position: 'left' | 'right';
}

const ChatMessage: React.FC<ChatMessageProps> = memo(function ChatMessage({
  message,
  position,
}) {
  return (
    <View className={clsx(classes.container, classes.position[position])}>
      <Text className={classes.message}>{message}</Text>
    </View>
  );
});

const classes = {
  container:
    'flex-0 max-w-[80%] bg-primary-50 px-4 py-3 border border-slate-100 rounded-lg',
  message: 'text-slate-600',
  position: {
    left: 'self-start',
    right: 'self-end',
  },
};

export default ChatMessage;
