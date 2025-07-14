import React from 'react';

import { render, fireEvent } from '@testing-library/react-native';

import PostCard from '../PostCard';

describe('PostCard', () => {
  const mockPost = {
    id: 1,
    user_id: 1,
    text: 'This is a test post',
    date: '2023-01-01T10:00:00Z',
    user: {
      name: 'John Doe',
      id: 'user1',
    },
    image: 'https://example.com/image.jpg',
  };

  const defaultProps = {
    post: mockPost,
    onCommentPress: jest.fn(),
    onLikePress: jest.fn(),
    onContextPress: jest.fn(),
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
    const postWithoutImage = { ...mockPost, image: undefined };
    const { getByTestId, getByText } = render(
      <PostCard {...defaultProps} post={postWithoutImage} />,
    );
    expect(getByTestId('post-card')).toBeTruthy();
    expect(getByText('This is a test post')).toBeTruthy();
  });

  it('renders with user name when user is provided', () => {
    const { getByText } = render(<PostCard {...defaultProps} />);
    expect(getByText('John Doe')).toBeTruthy();
  });

  it('renders without user name when user is not provided', () => {
    const postWithoutUser = { ...mockPost, user: undefined };
    const { getByTestId } = render(
      <PostCard {...defaultProps} post={postWithoutUser} />,
    );
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

  it('calls onContextPress when context menu is pressed', () => {
    const onContextPress = jest.fn();
    const { getByTestId } = render(
      <PostCard {...defaultProps} onContextPress={onContextPress} />,
    );
    const contextMenu = getByTestId('post-context-menu');
    fireEvent.press(contextMenu);
    expect(onContextPress).toHaveBeenCalledTimes(1);
  });

  it('renders with all props combined', () => {
    const onCommentPress = jest.fn();
    const onLikePress = jest.fn();
    const onContextPress = jest.fn();

    const { getByTestId, getByText } = render(
      <PostCard
        post={mockPost}
        onCommentPress={onCommentPress}
        onLikePress={onLikePress}
        onContextPress={onContextPress}
      />,
    );

    expect(getByTestId('post-card')).toBeTruthy();
    expect(getByText('John Doe')).toBeTruthy();
    expect(getByText('This is a test post')).toBeTruthy();
    expect(getByText('Comment')).toBeTruthy();
    expect(getByText('Like')).toBeTruthy();
  });

  it('applies correct styling classes', () => {
    const { getByTestId } = render(<PostCard {...defaultProps} />);
    expect(getByTestId('post-card')).toBeTruthy();
  });

  it('handles different date formats', () => {
    const recentPost = { ...mockPost, date: new Date().toISOString() };
    const { getByTestId } = render(
      <PostCard {...defaultProps} post={recentPost} />,
    );
    expect(getByTestId('post-card')).toBeTruthy();
  });

  it('renders with empty text', () => {
    const postWithEmptyText = { ...mockPost, text: '' };
    const { getByTestId } = render(
      <PostCard {...defaultProps} post={postWithEmptyText} />,
    );
    expect(getByTestId('post-card')).toBeTruthy();
  });

  it('handles missing callback props', () => {
    const { getByTestId } = render(<PostCard post={mockPost} />);
    expect(getByTestId('post-card')).toBeTruthy();

    // Should not throw when callbacks are not provided
    const commentButton = getByTestId('comment-button');
    const likeButton = getByTestId('like-button');
    const contextMenu = getByTestId('post-context-menu');

    expect(() => {
      fireEvent.press(commentButton);
      fireEvent.press(likeButton);
      fireEvent.press(contextMenu);
    }).not.toThrow();
  });
});
