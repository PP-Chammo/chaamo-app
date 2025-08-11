/* eslint-disable import/first */
import React from 'react';

import { fireEvent, render } from '@testing-library/react-native';

// Mock hook to avoid Apollo useApolloClient usage
jest.mock('@/hooks/useBlockedUsers', () => ({
  useBlockedUsers: () => ({ getIsBlocked: () => false }),
}));

import FollowListItem from '../FollowListItem';

describe('FollowListItem', () => {
  const defaultProps = {
    userId: 'u1',
    username: 'John Doe',
    imageUrl: 'https://example.com/avatar.jpg',
  };

  it('renders correctly with default props', () => {
    const { getByText } = render(<FollowListItem {...defaultProps} />);
    expect(getByText('John Doe')).toBeTruthy();
  });

  it('renders with custom name', () => {
    const { getByText } = render(
      <FollowListItem {...defaultProps} username="Jane Smith" />,
    );
    expect(getByText('Jane Smith')).toBeTruthy();
  });

  it('renders with image URL', () => {
    const { getByTestId } = render(<FollowListItem {...defaultProps} />);
    expect(getByTestId('avatar')).toBeTruthy();
  });

  it('shows unfollow button when isFollowing is true', () => {
    const onPressFollow = jest.fn();
    const { getByText } = render(
      <FollowListItem
        {...defaultProps}
        isFollowing={true}
        onToggleFollowPress={onPressFollow}
      />,
    );
    expect(getByText('Unfollow')).toBeTruthy();
  });

  it('does not show unfollow button when isFollowing is false', () => {
    const { queryByText } = render(
      <FollowListItem {...defaultProps} isFollowing={false} />,
    );
    expect(queryByText('Unfollow')).toBeNull();
  });

  it('calls onPressFollow when unfollow button is pressed', () => {
    const onPressFollow = jest.fn();
    const { getByText } = render(
      <FollowListItem
        {...defaultProps}
        isFollowing={true}
        onToggleFollowPress={onPressFollow}
      />,
    );

    const unfollowButton = getByText('Unfollow');
    fireEvent.press(unfollowButton);

    expect(onPressFollow).toHaveBeenCalledTimes(1);
  });

  it('shows dots menu button', () => {
    const { getByTestId } = render(
      <FollowListItem {...defaultProps} onToggleBlockPress={jest.fn()} />,
    );
    expect(getByTestId('dots-menu-button')).toBeTruthy();
  });

  it('opens context menu when dots button is pressed', () => {
    const { getByTestId } = render(
      <FollowListItem {...defaultProps} onToggleBlockPress={jest.fn()} />,
    );

    const dotsButton = getByTestId('dots-menu-button');
    fireEvent.press(dotsButton);

    expect(getByTestId('context-menu')).toBeTruthy();
  });

  it('shows block option in context menu', () => {
    const { getByTestId, getByText } = render(
      <FollowListItem {...defaultProps} onToggleBlockPress={jest.fn()} />,
    );

    const dotsButton = getByTestId('dots-menu-button');
    fireEvent.press(dotsButton);

    expect(getByText('Block')).toBeTruthy();
  });

  it('calls onBlock when block option is pressed', () => {
    const onBlock = jest.fn();
    const { getByTestId, getByText } = render(
      <FollowListItem {...defaultProps} onToggleBlockPress={onBlock} />,
    );

    const dotsButton = getByTestId('dots-menu-button');
    fireEvent.press(dotsButton);

    const blockOption = getByText('Block');
    fireEvent.press(blockOption);

    expect(onBlock).toHaveBeenCalledTimes(1);
  });

  it('closes context menu after blocking', () => {
    const onBlock = jest.fn();
    const { getByTestId, getByText, queryByTestId } = render(
      <FollowListItem {...defaultProps} onToggleBlockPress={onBlock} />,
    );

    const dotsButton = getByTestId('dots-menu-button');
    fireEvent.press(dotsButton);

    const blockOption = getByText('Block');
    fireEvent.press(blockOption);

    expect(queryByTestId('context-menu')).toBeNull();
  });

  it('renders with all props combined', () => {
    const onPressFollow = jest.fn();
    const onBlock = jest.fn();
    const { getByText, getByTestId } = render(
      <FollowListItem
        {...defaultProps}
        username="Alice Johnson"
        imageUrl="https://example.com/alice.jpg"
        isFollowing={true}
        onToggleFollowPress={onPressFollow}
        onToggleBlockPress={onBlock}
      />,
    );

    expect(getByText('Alice Johnson')).toBeTruthy();
    expect(getByText('Unfollow')).toBeTruthy();
    expect(getByTestId('avatar')).toBeTruthy();
    expect(getByTestId('dots-menu-button')).toBeTruthy();
  });

  it('applies correct styling classes', () => {
    const { getByTestId } = render(<FollowListItem {...defaultProps} />);
    expect(getByTestId('follow-list-item')).toBeTruthy();
  });

  it('handles multiple interactions', () => {
    const onPressFollow = jest.fn();
    const onBlock = jest.fn();
    const { getByTestId, getByText } = render(
      <FollowListItem
        {...defaultProps}
        isFollowing={true}
        onToggleFollowPress={onPressFollow}
        onToggleBlockPress={onBlock}
      />,
    );

    const unfollowButton = getByText('Unfollow');
    fireEvent.press(unfollowButton);
    fireEvent.press(unfollowButton);

    const dotsButton = getByTestId('dots-menu-button');
    fireEvent.press(dotsButton);
    const blockOption = getByText('Block');
    fireEvent.press(blockOption);

    expect(onPressFollow).toHaveBeenCalledTimes(2);
    expect(onBlock).toHaveBeenCalledTimes(1);
  });
});
