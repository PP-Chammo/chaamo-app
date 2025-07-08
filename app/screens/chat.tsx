import { useState } from 'react';

import { format } from 'date-fns';
import { router, useLocalSearchParams } from 'expo-router';
import { FlatList, Text, View } from 'react-native';

import {
  Avatar,
  ChatMessage,
  Icon,
  Label,
  ScreenContainer,
} from '@/components/atoms';
import { Header, TextField } from '@/components/molecules';
import { dummyChatMessages } from '@/constants/dummy';
import { FlatData, TextChangeParams } from '@/domains';
import {
  DateGroupedMessages,
  GroupedMessage,
  groupMessagesByDateAndSender,
} from '@/utils/chat';
import { getColor } from '@/utils/getColor';

export default function ChatScreen() {
  const { name } = useLocalSearchParams();

  const [message, setMessage] = useState('');

  const session = 'John Doe';
  const groupedByDate: DateGroupedMessages[] =
    groupMessagesByDateAndSender(dummyChatMessages);

  const flatData: FlatData<GroupedMessage>[] = [];
  groupedByDate.forEach((dateGroup) => {
    flatData.push({ type: 'date', date: dateGroup.date });
    dateGroup.groups.forEach((group) => {
      flatData.push({ type: 'group', group, date: dateGroup.date });
    });
  });

  const handleChangeMessage = ({ value }: TextChangeParams) => {
    setMessage(value);
  };

  return (
    <ScreenContainer>
      <Header
        leftComponent={
          <View className={classes.leftComponent}>
            <Avatar size={26} />
            <Label className={classes.name}>{name}</Label>
          </View>
        }
        onBackPress={() => router.back()}
      />
      <FlatList
        data={flatData}
        keyExtractor={(item) => {
          if (item.type === 'date') return `date-${item.date}`;
          return `group-${item.group.id}`;
        }}
        className={classes.flatList}
        contentContainerClassName={classes.contentContainer}
        renderItem={({ item }) => {
          if (item.type === 'date') {
            return (
              <Text className={classes.dateText}>
                {format(new Date(item.date), 'd MMM yyyy')}
              </Text>
            );
          }

          const group = item.group;
          if (group.sender === session) {
            return (
              <View className={classes.messageContainerMe}>
                {group.messages.map((message) => (
                  <ChatMessage key={message.id} message={message.message} />
                ))}
              </View>
            );
          }
          return (
            <View className={classes.messageContainerOther}>
              <View className={classes.messageOtherContent}>
                <Avatar size={26} />
                <View className={classes.messagesGroup}>
                  {group.messages.map((message) => (
                    <ChatMessage key={message.id} message={message.message} />
                  ))}
                </View>
              </View>
            </View>
          );
        }}
      />
      <View className={classes.bottomContainer}>
        <Icon
          variant="FontAwesome6"
          name="add"
          size={24}
          color={getColor('slate-500')}
        />
        <View className={classes.messageInputContainer}>
          <TextField
            className={classes.messageInput}
            name="message"
            onChange={handleChangeMessage}
            value={message}
          />
        </View>
        <Icon name="send" size={24} color={getColor('slate-500')} />
      </View>
    </ScreenContainer>
  );
}

const classes = {
  leftComponent: 'flex-row items-center gap-2',
  name: 'text-lg font-medium',
  messageContainerMe: 'self-end mb-2',
  messageContainerOther: 'mb-2',
  messageOtherContent: 'flex-row items-start gap-2',
  messagesGroup: 'gap-1',
  contentContainer: 'mx-6',
  bottomContainer: 'flex-row gap-4 items-center px-4 py-6 bg-white',
  messageInput: 'bg-teal-50 border border-slate-200 rounded-xl',
  dateText: 'text-center text-slate-500 my-5',
  flatList: 'bg-white/50',
  messageInputContainer: 'flex-1',
};
