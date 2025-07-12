import React from 'react';

import { render, fireEvent } from '@testing-library/react-native';

import FollowListItem from '../FollowListItem';

describe('FollowListItem', () => {
  const defaultProps = {
    name: 'John Doe',
    imageUrl: 'https://example.com/avatar.jpg',
  };

  it('renders correctly with default props', () => {
    const { getByText } = render(<FollowListItem {...defaultProps} />);
    expect(getByText('John Doe')).toBeTruthy();
  });

  it('renders with custom name', () => {
    const { getByText } = render(
      <FollowListItem {...defaultProps} name="Jane Smith" />,
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
        onPressFollow={onPressFollow}
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
        onPressFollow={onPressFollow}
      />,
    );

    const unfollowButton = getByText('Unfollow');
    fireEvent.press(unfollowButton);

    expect(onPressFollow).toHaveBeenCalledTimes(1);
  });

  it('shows dots menu button', () => {
    const { getByTestId } = render(<FollowListItem {...defaultProps} />);
    expect(getByTestId('dots-menu-button')).toBeTruthy();
  });

  it('opens context menu when dots button is pressed', () => {
    const { getByTestId } = render(<FollowListItem {...defaultProps} />);

    const dotsButton = getByTestId('dots-menu-button');
    fireEvent.press(dotsButton);

    // Context menu should be visible
    expect(getByTestId('context-menu')).toBeTruthy();
  });

  it('shows block option in context menu', () => {
    const { getByTestId, getByText } = render(
      <FollowListItem {...defaultProps} />,
    );

    const dotsButton = getByTestId('dots-menu-button');
    fireEvent.press(dotsButton);

    expect(getByText('Block')).toBeTruthy();
  });

  it('calls onBlock when block option is pressed', () => {
    const onBlock = jest.fn();
    const { getByTestId, getByText } = render(
      <FollowListItem {...defaultProps} onBlock={onBlock} />,
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
      <FollowListItem {...defaultProps} onBlock={onBlock} />,
    );

    const dotsButton = getByTestId('dots-menu-button');
    fireEvent.press(dotsButton);

    const blockOption = getByText('Block');
    fireEvent.press(blockOption);

    // Context menu should be closed
    expect(queryByTestId('context-menu')).toBeNull();
  });

  it('renders with all props combined', () => {
    const onPressFollow = jest.fn();
    const onBlock = jest.fn();
    const { getByText, getByTestId } = render(
      <FollowListItem
        {...defaultProps}
        name="Alice Johnson"
        imageUrl="https://example.com/alice.jpg"
        isFollowing={true}
        onPressFollow={onPressFollow}
        onBlock={onBlock}
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
        onPressFollow={onPressFollow}
        onBlock={onBlock}
      />,
    );

    // Press unfollow multiple times
    const unfollowButton = getByText('Unfollow');
    fireEvent.press(unfollowButton);
    fireEvent.press(unfollowButton);

    // Open context menu and block
    const dotsButton = getByTestId('dots-menu-button');
    fireEvent.press(dotsButton);
    const blockOption = getByText('Block');
    fireEvent.press(blockOption);

    expect(onPressFollow).toHaveBeenCalledTimes(2);
    expect(onBlock).toHaveBeenCalledTimes(1);
  });
});
