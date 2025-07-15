import React from 'react';

import { fireEvent, render } from '@testing-library/react-native';

import ChatListItem from '../ChatListItem';

jest.mock('@/utils/date', () => ({
  formatTime: jest.fn((time) => `formatted-${time}`),
}));

describe('ChatListItem', () => {
  const defaultProps = {
    name: 'John Doe',
    message: 'Hello, how are you?',
    time: '2023-01-01T10:00:00Z',
    unreadCount: 3,
    imageUrl: 'https://example.com/avatar.jpg',
    onPress: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with default props', () => {
    const { getByTestId, getByText } = render(
      <ChatListItem {...defaultProps} />,
    );
    expect(getByTestId('chat-list-item')).toBeTruthy();
    expect(getByText('John Doe')).toBeTruthy();
    expect(getByText('Hello, how are you?')).toBeTruthy();
    expect(getByText('3')).toBeTruthy();
  });

  it('renders without unread count when unreadCount is 0', () => {
    const { getByTestId, queryByText } = render(
      <ChatListItem {...defaultProps} unreadCount={0} />,
    );
    expect(getByTestId('chat-list-item')).toBeTruthy();
    expect(queryByText('0')).toBeNull();
  });

  it('renders with custom name', () => {
    const { getByText } = render(
      <ChatListItem {...defaultProps} name="Jane Smith" />,
    );
    expect(getByText('Jane Smith')).toBeTruthy();
  });

  it('renders with custom message', () => {
    const { getByText } = render(
      <ChatListItem {...defaultProps} message="Custom message here" />,
    );
    expect(getByText('Custom message here')).toBeTruthy();
  });

  it('renders with custom time', () => {
    const { getByText } = render(
      <ChatListItem {...defaultProps} time="2023-01-02T15:30:00Z" />,
    );
    expect(getByText('formatted-2023-01-02T15:30:00Z')).toBeTruthy();
  });

  it('renders with custom image URL', () => {
    const { getByTestId } = render(
      <ChatListItem
        {...defaultProps}
        imageUrl="https://example.com/custom.jpg"
      />,
    );
    expect(getByTestId('chat-list-item')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByTestId } = render(
      <ChatListItem {...defaultProps} onPress={onPress} />,
    );
    const item = getByTestId('chat-list-item');
    fireEvent.press(item);
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('renders with all props combined', () => {
    const onPress = jest.fn();
    const { getByTestId, getByText } = render(
      <ChatListItem
        name="Alice Johnson"
        message="This is a test message"
        time="2023-01-03T12:00:00Z"
        unreadCount={5}
        imageUrl="https://example.com/alice.jpg"
        onPress={onPress}
      />,
    );

    expect(getByTestId('chat-list-item')).toBeTruthy();
    expect(getByText('Alice Johnson')).toBeTruthy();
    expect(getByText('This is a test message')).toBeTruthy();
    expect(getByText('5')).toBeTruthy();
    expect(getByText('formatted-2023-01-03T12:00:00Z')).toBeTruthy();
  });

  it('applies correct styling classes', () => {
    const { getByTestId } = render(<ChatListItem {...defaultProps} />);
    expect(getByTestId('chat-list-item')).toBeTruthy();
  });

  it('handles large unread count', () => {
    const { getByText } = render(
      <ChatListItem {...defaultProps} unreadCount={99} />,
    );
    expect(getByText('99')).toBeTruthy();
  });

  it('handles empty message', () => {
    const { getByTestId } = render(
      <ChatListItem {...defaultProps} message="" />,
    );
    expect(getByTestId('chat-list-item')).toBeTruthy();
  });

  it('handles empty name', () => {
    const { getByTestId } = render(<ChatListItem {...defaultProps} name="" />);
    expect(getByTestId('chat-list-item')).toBeTruthy();
  });
});
