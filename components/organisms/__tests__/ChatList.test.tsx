import React from 'react';

import { render, fireEvent } from '@testing-library/react-native';

import { dummyChatList } from '@/constants/dummy';

import ChatList from '../ChatList';

// Mock GraphQL generated hooks used by ChatList
jest.mock('@/generated/graphql', () => {
  const original = jest.requireActual('@/generated/graphql');
  return {
    __esModule: true,
    ...original,
    useGetVwMyConversationsLazyQuery: jest.fn(() => {
      const { dummyChatList } = jest.requireActual('@/constants/dummy');
      const edges = dummyChatList.map(
        (item: {
          id: number;
          name: string;
          message: string;
          time: string;
          unreadCount: number;
          imageUrl: string;
        }) => ({
          node: {
            id: item.id,
            username: item.name,
            content: item.message,
            created_at: item.time,
            unread_count: item.unreadCount,
            profile_image_url: item.imageUrl,
            partner_id: String(item.id),
          },
        }),
      );
      return [
        jest.fn(),
        {
          data: {
            vw_myconversationsCollection: {
              edges,
            },
          },
          refetch: jest.fn(),
        },
      ];
    }),
    useUpdateMessagesMutation: jest.fn(() => [jest.fn()]),
  };
});

describe('ChatList', () => {
  const onPressMock = jest.fn();

  it('renders correctly', () => {
    const { getByTestId } = render(<ChatList onPress={onPressMock} />);
    expect(getByTestId('chat-list')).toBeTruthy();
  });

  it('renders all chat list items', () => {
    const { getAllByTestId } = render(<ChatList onPress={onPressMock} />);
    const chatListItems = getAllByTestId('chat-list-item');
    expect(chatListItems.length).toBe(dummyChatList.length);
  });

  it('calls onPress with correct arguments when a chat item is pressed', () => {
    const { getAllByTestId } = render(<ChatList onPress={onPressMock} />);
    const chatListItems = getAllByTestId('chat-list-item');
    fireEvent.press(chatListItems[0]);
    expect(onPressMock).toHaveBeenCalledWith(String(dummyChatList[0].id));
  });
});
