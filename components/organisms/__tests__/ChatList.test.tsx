import React from 'react';

import { render, fireEvent } from '@testing-library/react-native';

import { dummyChatList } from '@/constants/dummy';

import ChatList from '../ChatList';

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
    expect(onPressMock).toHaveBeenCalledWith(
      dummyChatList[0].id,
      dummyChatList[0].name,
    );
  });
});
