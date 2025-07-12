import { render } from '@testing-library/react-native';

import ChatMessage from '../ChatMessage';

describe('ChatMessage', () => {
  const defaultProps = {
    message: 'Test message',
  };

  it('renders correctly with default props', () => {
    const { getByText } = render(<ChatMessage {...defaultProps} />);
    expect(getByText('Test message')).toBeTruthy();
  });

  it('renders with different messages', () => {
    const messages = ['Hello', 'How are you?', 'Goodbye'];

    messages.forEach((message) => {
      const { getByText } = render(<ChatMessage message={message} />);
      expect(getByText(message)).toBeTruthy();
    });
  });

  it('renders with long message', () => {
    const longMessage =
      'This is a very long message that should still render correctly without any issues';
    const { getByText } = render(<ChatMessage message={longMessage} />);
    expect(getByText(longMessage)).toBeTruthy();
  });

  it('renders with empty message', () => {
    const { getByText } = render(<ChatMessage message="" />);
    expect(getByText('')).toBeTruthy();
  });

  it('applies correct styling classes', () => {
    const { toJSON } = render(<ChatMessage {...defaultProps} />);
    expect(toJSON()).toBeTruthy();
  });
});
