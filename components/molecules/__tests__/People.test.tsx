import React from 'react';

import { render, fireEvent } from '@testing-library/react-native';

import People from '../People';

describe('People', () => {
  const defaultProps = {
    fullname: 'John Doe',
  };

  it('renders correctly with default props', () => {
    const { getByText } = render(<People {...defaultProps} />);
    expect(getByText('John Doe')).toBeTruthy();
  });

  it('renders with image URL', () => {
    const { getByTestId } = render(
      <People {...defaultProps} imageUrl="https://example.com/avatar.jpg" />,
    );
    expect(getByTestId('avatar')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByTestId } = render(
      <People {...defaultProps} onPress={onPress} />,
    );

    const container = getByTestId('people-item');
    fireEvent.press(container);

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('renders follow button when onFollowPress is provided', () => {
    const onFollowPress = jest.fn();
    const { getByText } = render(
      <People {...defaultProps} onFollowPress={onFollowPress} />,
    );
    expect(getByText('Follow')).toBeTruthy();
  });

  it('calls onFollowPress when follow button is pressed', () => {
    const onFollowPress = jest.fn();
    const { getByText } = render(
      <People {...defaultProps} onFollowPress={onFollowPress} />,
    );

    const followButton = getByText('Follow');
    fireEvent.press(followButton);

    expect(onFollowPress).toHaveBeenCalledTimes(1);
  });

  it('renders view profile link when onViewProfilePress is provided', () => {
    const onViewProfilePress = jest.fn();
    const { getByText } = render(
      <People {...defaultProps} onViewProfilePress={onViewProfilePress} />,
    );
    expect(getByText('View Profile')).toBeTruthy();
  });

  it('calls onViewProfilePress when view profile is pressed', () => {
    const onViewProfilePress = jest.fn();
    const { getByText } = render(
      <People {...defaultProps} onViewProfilePress={onViewProfilePress} />,
    );

    const viewProfileLink = getByText('View Profile');
    fireEvent.press(viewProfileLink);

    expect(onViewProfilePress).toHaveBeenCalledTimes(1);
  });

  it('renders with custom fullname', () => {
    const { getByText } = render(
      <People {...defaultProps} fullname="Jane Smith" />,
    );
    expect(getByText('Jane Smith')).toBeTruthy();
  });

  it('does not render follow button when onFollowPress is not provided', () => {
    const { queryByText } = render(<People {...defaultProps} />);
    expect(queryByText('Follow')).toBeNull();
  });

  it('does not render view profile link when onViewProfilePress is not provided', () => {
    const { queryByText } = render(<People {...defaultProps} />);
    expect(queryByText('View Profile')).toBeNull();
  });

  it('renders with all props combined', () => {
    const onPress = jest.fn();
    const onFollowPress = jest.fn();
    const onViewProfilePress = jest.fn();

    const { getByText, getByTestId } = render(
      <People
        {...defaultProps}
        fullname="Alice Johnson"
        imageUrl="https://example.com/alice.jpg"
        onPress={onPress}
        onFollowPress={onFollowPress}
        onViewProfilePress={onViewProfilePress}
      />,
    );

    expect(getByText('Alice Johnson')).toBeTruthy();
    expect(getByText('Follow')).toBeTruthy();
    expect(getByText('View Profile')).toBeTruthy();
    expect(getByTestId('avatar')).toBeTruthy();
  });

  it('applies correct styling classes', () => {
    const { getByTestId } = render(<People {...defaultProps} />);
    expect(getByTestId('people-item')).toBeTruthy();
  });
});
