import { format } from 'date-fns';

export interface ChatMessage {
  id: number;
  message: string;
  time: string;
  sender: string;
  receiver: string;
}

export interface GroupedMessage {
  id: number;
  messages: ChatMessage[];
  sender: string;
  time: string;
}

export interface DateGroupedMessages {
  date: string;
  groups: GroupedMessage[];
}

export const groupMessagesByDateAndSender = (
  messages: ChatMessage[],
): DateGroupedMessages[] => {
  if (!messages.length) {
    return [];
  }

  const dateMap: Record<string, ChatMessage[]> = {};

  for (let msg of messages) {
    const dateKey = format(new Date(msg.time), 'yyyy-MM-dd');
    if (!dateMap[dateKey]) dateMap[dateKey] = [];
    dateMap[dateKey].push(msg);
  }

  const result: DateGroupedMessages[] = [];
  for (const date in dateMap) {
    if (!Object.prototype.hasOwnProperty.call(dateMap, date)) continue;
    const msgs = dateMap[date];
    const groups: GroupedMessage[] = [];
    let currentGroup: ChatMessage[] = [msgs[0]];

    for (let i = 1; i < msgs.length; i++) {
      const current = msgs[i];
      const prev = msgs[i - 1];

      if (current.sender === prev.sender) {
        currentGroup.push(current);
      } else {
        groups.push({
          id: currentGroup[0].id,
          messages: currentGroup,
          sender: currentGroup[0].sender,
          time: currentGroup[0].time,
        });
        currentGroup = [current];
      }
    }
    if (currentGroup.length > 0) {
      groups.push({
        id: currentGroup[0].id,
        messages: currentGroup,
        sender: currentGroup[0].sender,
        time: currentGroup[0].time,
      });
    }
    result.push({ date, groups });
  }

  result.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );

  return result;
};
