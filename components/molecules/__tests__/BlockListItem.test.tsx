import React from 'react';

import { render, fireEvent } from '@testing-library/react-native';

import BlockListItem from '../BlockListItem';

describe('BlockListItem', () => {
  const defaultProps = {
    name: 'John Doe',
    imageUrl: 'https://example.com/avatar.jpg',
    isBlocked: false,
    onPress: jest.fn(),
  };

  it('renders correctly with default props', () => {
    const { getByText } = render(<BlockListItem {...defaultProps} />);
    expect(getByText('John Doe')).toBeTruthy();
    expect(getByText('Block')).toBeTruthy();
  });

  it('renders with blocked state', () => {
    const { getByText } = render(
      <BlockListItem {...defaultProps} isBlocked={true} />,
    );
    expect(getByText('John Doe')).toBeTruthy();
    expect(getByText('Unblock')).toBeTruthy();
  });

  it('calls onPress when button is pressed', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <BlockListItem {...defaultProps} onPress={onPress} />,
    );

    const button = getByText('Block');
    fireEvent.press(button);

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('renders with custom name', () => {
    const { getByText } = render(
      <BlockListItem {...defaultProps} name="Jane Smith" />,
    );
    expect(getByText('Jane Smith')).toBeTruthy();
  });

  it('renders with custom image URL', () => {
    const { getByTestId } = render(
      <BlockListItem
        {...defaultProps}
        imageUrl="https://example.com/custom.jpg"
      />,
    );
    expect(getByTestId('avatar')).toBeTruthy();
  });

  it('shows Block button when not blocked', () => {
    const { getByText, queryByText } = render(
      <BlockListItem {...defaultProps} isBlocked={false} />,
    );
    expect(getByText('Block')).toBeTruthy();
    expect(queryByText('Unblock')).toBeNull();
  });

  it('shows Unblock button when blocked', () => {
    const { getByText, queryByText } = render(
      <BlockListItem {...defaultProps} isBlocked={true} />,
    );
    expect(getByText('Unblock')).toBeTruthy();
    expect(queryByText('Block')).toBeNull();
  });

  it('handles multiple button presses', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <BlockListItem {...defaultProps} onPress={onPress} />,
    );

    const button = getByText('Block');

    fireEvent.press(button);
    fireEvent.press(button);
    fireEvent.press(button);

    expect(onPress).toHaveBeenCalledTimes(3);
  });

  it('renders with all props combined', () => {
    const onPress = jest.fn();
    const { getByText, getByTestId } = render(
      <BlockListItem
        name="Alice Johnson"
        imageUrl="https://example.com/alice.jpg"
        isBlocked={true}
        onPress={onPress}
      />,
    );

    expect(getByText('Alice Johnson')).toBeTruthy();
    expect(getByText('Unblock')).toBeTruthy();
    expect(getByTestId('avatar')).toBeTruthy();
  });

  it('applies correct styling classes', () => {
    const { getByTestId } = render(<BlockListItem {...defaultProps} />);
    expect(getByTestId('block-list-item')).toBeTruthy();
  });

  it('renders avatar with correct size', () => {
    const { getByTestId } = render(<BlockListItem {...defaultProps} />);
    const avatar = getByTestId('avatar');
    expect(avatar).toBeTruthy();
  });
});
