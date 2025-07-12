import { groupMessagesByDateAndSender, ChatMessage } from '../chat';

describe('groupMessagesByDateAndSender', () => {
  it('should return empty array for empty input', () => {
    expect(groupMessagesByDateAndSender([])).toEqual([]);
  });

  it('should handle a single message', () => {
    const messages: ChatMessage[] = [
      {
        id: 1,
        message: 'Hi',
        time: '2024-06-01T10:00:00Z',
        sender: 'A',
        receiver: 'B',
      },
    ];
    const result = groupMessagesByDateAndSender(messages);
    expect(result).toHaveLength(1);
    expect(result[0].groups).toHaveLength(1);
    expect(result[0].groups[0].messages).toHaveLength(1);
  });

  it('should group consecutive messages by sender within the same date', () => {
    const messages: ChatMessage[] = [
      {
        id: 1,
        message: 'Hi',
        time: '2024-06-01T10:00:00Z',
        sender: 'A',
        receiver: 'B',
      },
      {
        id: 2,
        message: 'Hello',
        time: '2024-06-01T10:01:00Z',
        sender: 'A',
        receiver: 'B',
      },
      {
        id: 3,
        message: 'Hey',
        time: '2024-06-01T10:02:00Z',
        sender: 'B',
        receiver: 'A',
      },
      {
        id: 4,
        message: 'Yo',
        time: '2024-06-01T10:03:00Z',
        sender: 'A',
        receiver: 'B',
      },
    ];
    const result = groupMessagesByDateAndSender(messages);
    expect(result).toHaveLength(1);
    expect(result[0].groups).toHaveLength(3);
    expect(result[0].groups[0].sender).toBe('A');
    expect(result[0].groups[1].sender).toBe('B');
    expect(result[0].groups[2].sender).toBe('A');
  });

  it('should group messages by date and sort dates ascending', () => {
    const messages: ChatMessage[] = [
      {
        id: 1,
        message: 'Hi',
        time: '2024-06-02T10:00:00Z',
        sender: 'A',
        receiver: 'B',
      },
      {
        id: 2,
        message: 'Hello',
        time: '2024-06-01T10:01:00Z',
        sender: 'A',
        receiver: 'B',
      },
    ];
    const result = groupMessagesByDateAndSender(messages);
    expect(result).toHaveLength(2);
    expect(result[0].date < result[1].date).toBe(true);
  });
});
