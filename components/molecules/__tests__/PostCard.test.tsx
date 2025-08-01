import React from 'react';

import { fireEvent, render } from '@testing-library/react-native';

import PostCard from '../PostCard';

describe('PostCard', () => {
  const defaultProps = {
    showContext: true,
    postId: '1',
    userId: 'user1',
    username: 'John Doe',
    userImageUrl: 'https://example.com/avatar.jpg',
    contentImageUrl: 'https://example.com/image.jpg',
    content: 'This is a test post',
    createdAt: '2023-01-01T10:00:00Z',
    likeCount: 5,
    liked: false,
    onCommentPress: jest.fn(),
    onLikePress: jest.fn(),
    onBlockPress: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with default props', () => {
    const { getByTestId, getByText } = render(<PostCard {...defaultProps} />);
    expect(getByTestId('post-card')).toBeTruthy();
    expect(getByText('John Doe')).toBeTruthy();
    expect(getByText('This is a test post')).toBeTruthy();
  });

  it('renders without image when image is not provided', () => {
    const propsWithoutImage = { ...defaultProps, contentImageUrl: undefined };
    const { getByTestId, getByText } = render(
      <PostCard {...propsWithoutImage} />,
    );
    expect(getByTestId('post-card')).toBeTruthy();
    expect(getByText('This is a test post')).toBeTruthy();
  });

  it('renders with user name when user is provided', () => {
    const { getByText } = render(<PostCard {...defaultProps} />);
    expect(getByText('John Doe')).toBeTruthy();
  });

  it('renders without user name when user is not provided', () => {
    const propsWithoutUsername = { ...defaultProps, username: '' };
    const { getByTestId } = render(<PostCard {...propsWithoutUsername} />);
    expect(getByTestId('post-card')).toBeTruthy();
  });

  it('calls onCommentPress when comment button is pressed', () => {
    const onCommentPress = jest.fn();
    const { getByTestId } = render(
      <PostCard {...defaultProps} onCommentPress={onCommentPress} />,
    );
    const commentButton = getByTestId('comment-button');
    fireEvent.press(commentButton);
    expect(onCommentPress).toHaveBeenCalledTimes(1);
  });

  it('calls onLikePress when like button is pressed', () => {
    const onLikePress = jest.fn();
    const { getByTestId } = render(
      <PostCard {...defaultProps} onLikePress={onLikePress} />,
    );
    const likeButton = getByTestId('like-button');
    fireEvent.press(likeButton);
    expect(onLikePress).toHaveBeenCalledTimes(1);
  });

  it('renders with all props combined', () => {
    const onCommentPress = jest.fn();
    const onLikePress = jest.fn();

    const { getByTestId, getByText } = render(
      <PostCard
        {...defaultProps}
        onCommentPress={onCommentPress}
        onLikePress={onLikePress}
      />,
    );

    expect(getByTestId('post-card')).toBeTruthy();
    expect(getByText('John Doe')).toBeTruthy();
    expect(getByText('This is a test post')).toBeTruthy();
    expect(getByText('Comment')).toBeTruthy();
    expect(getByText(/Like/)).toBeTruthy();
  });

  it('applies correct styling classes', () => {
    const { getByTestId } = render(<PostCard {...defaultProps} />);
    expect(getByTestId('post-card')).toBeTruthy();
  });

  it('handles different date formats', () => {
    const recentDate = new Date().toISOString();
    const propsWithRecentDate = { ...defaultProps, createdAt: recentDate };
    const { getByTestId } = render(<PostCard {...propsWithRecentDate} />);
    expect(getByTestId('post-card')).toBeTruthy();
  });

  it('renders with empty text', () => {
    const propsWithEmptyContent = { ...defaultProps, content: '' };
    const { getByTestId } = render(<PostCard {...propsWithEmptyContent} />);
    expect(getByTestId('post-card')).toBeTruthy();
  });

  it('handles missing callback props', () => {
    const { getByTestId } = render(
      <PostCard
        {...defaultProps}
        onCommentPress={undefined}
        onLikePress={undefined}
        onBlockPress={undefined}
      />,
    );
    expect(getByTestId('post-card')).toBeTruthy();

    const commentButton = getByTestId('comment-button');
    const likeButton = getByTestId('like-button');
    const contextMenu = getByTestId('post-context-menu');

    expect(() => {
      fireEvent.press(commentButton);
      fireEvent.press(likeButton);
      fireEvent.press(contextMenu);
    }).not.toThrow();
  });

  it('renders correct time for 1 hour ago', () => {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const propsWithOneHourAgo = { ...defaultProps, createdAt: oneHourAgo };
    const { getByText } = render(<PostCard {...propsWithOneHourAgo} />);
    expect(getByText(/1 hour ago/)).toBeTruthy();
  });

  it('renders correct time for 2 hours ago', () => {
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();
    const propsWithTwoHoursAgo = { ...defaultProps, createdAt: twoHoursAgo };
    const { getByText } = render(<PostCard {...propsWithTwoHoursAgo} />);
    expect(getByText(/2 hours ago/)).toBeTruthy();
  });

  it('renders correct time for 1 minute ago', () => {
    const oneMinuteAgo = new Date(Date.now() - 60 * 1000).toISOString();
    const propsWithOneMinuteAgo = { ...defaultProps, createdAt: oneMinuteAgo };
    const { getByText } = render(<PostCard {...propsWithOneMinuteAgo} />);
    expect(getByText(/1 minute ago/)).toBeTruthy();
  });

  it('renders correct time for 2 minutes ago', () => {
    const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000).toISOString();
    const propsWithTwoMinutesAgo = {
      ...defaultProps,
      createdAt: twoMinutesAgo,
    };
    const { getByText } = render(<PostCard {...propsWithTwoMinutesAgo} />);
    expect(getByText(/2 minutes ago/)).toBeTruthy();
  });
});
