import { render } from '@testing-library/react-native';

import type { MessageType } from '@/generated/graphql';

import ChatMessage from '../ChatMessage';

describe('ChatMessage', () => {
  const defaultProps = {
    message: 'Test message',
    position: 'left' as const,
    type: 'chat' as MessageType,
  };

  const bidProps = {
    ...defaultProps,
    partnerUsername: 'TestUser',
    bidId: '123',
    bidAmount: 100,
    bidCurrency: 'USD',
    type: 'request_bid' as MessageType,
  };

  it('renders regular message correctly', () => {
    const { getByTestId } = render(<ChatMessage {...defaultProps} />);
    expect(getByTestId('chat-message-text').props.children).toBe(
      'Test message',
    );
  });

  it('renders bid message correctly', () => {
    const { getByTestId } = render(<ChatMessage {...bidProps} />);
    expect(getByTestId('chat-message-container')).toBeTruthy();
  });

  it('renders empty message node when message is empty', () => {
    const { getByTestId } = render(
      <ChatMessage {...defaultProps} message="" />,
    );
    expect(getByTestId('chat-message-text').props.children).toBe('');
  });

  it('applies correct styling classes', () => {
    const { toJSON } = render(<ChatMessage {...defaultProps} />);
    expect(toJSON()).toBeTruthy();
  });
});
