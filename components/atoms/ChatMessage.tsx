import { memo } from 'react';

import { Text, View } from 'react-native';

interface ChatMessageProps {
  message: string;
}

const ChatMessage: React.FC<ChatMessageProps> = memo(function ChatMessage({
  message,
}) {
  return (
    <View className={classes.container}>
      <Text className={classes.message}>{message}</Text>
    </View>
  );
});

const classes = {
  container:
    'w-[80%] bg-primary-50 px-5 py-3 border border-slate-100 rounded-lg',
  message: 'text-slate-600',
};

export default ChatMessage;
