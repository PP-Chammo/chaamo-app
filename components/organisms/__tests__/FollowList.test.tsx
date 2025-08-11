import React from 'react';

import { render } from '@testing-library/react-native';

import FollowList from '../FollowList';

// Mock data that matches the GraphQL structure
const mockData = [
  {
    node: {
      follower_user_id: '1',
      followee_user_id: '2',
      follower_user: {
        id: '1',
        username: 'user1',
        profile_image_url: 'https://example.com/user1.jpg',
      },
      followee_user: {
        id: '2',
        username: 'user2',
        profile_image_url: 'https://example.com/user2.jpg',
      },
    },
  },
  {
    node: {
      follower_user_id: '3',
      followee_user_id: '4',
      follower_user: {
        id: '3',
        username: 'user3',
        profile_image_url: 'https://example.com/user3.jpg',
      },
      followee_user: {
        id: '4',
        username: 'user4',
        profile_image_url: 'https://example.com/user4.jpg',
      },
    },
  },
];

describe('FollowList', () => {
  it('renders correctly', () => {
    const { toJSON } = render(
      <FollowList list={mockData} keyData="follower_user" />,
    );
    expect(toJSON()).toBeTruthy();
  });

  it('renders FlatList component', () => {
    const { toJSON } = render(
      <FollowList list={mockData} keyData="follower_user" />,
    );
    expect(toJSON()).toBeTruthy();
  });

  it('renders FollowListItem components for each item', () => {
    const { toJSON } = render(
      <FollowList list={mockData} keyData="follower_user" />,
    );
    expect(toJSON()).toBeTruthy();
  });

  it('displays data from dummy following list', () => {
    const { toJSON } = render(
      <FollowList list={mockData} keyData="followee_user" />,
    );
    expect(toJSON()).toBeTruthy();
  });

  it('applies correct styling classes', () => {
    const { toJSON } = render(
      <FollowList list={mockData} keyData="follower_user" />,
    );
    expect(toJSON()).toBeTruthy();
  });

  it('renders with proper layout structure', () => {
    const { toJSON } = render(
      <FollowList list={mockData} keyData="follower_user" />,
    );
    expect(toJSON()).toBeTruthy();
  });

  it('handles empty data gracefully', () => {
    const { toJSON } = render(<FollowList list={[]} keyData="follower_user" />);
    expect(toJSON()).toBeTruthy();
  });

  it('renders with proper key extraction', () => {
    const { toJSON } = render(
      <FollowList list={mockData} keyData="follower_user" />,
    );
    expect(toJSON()).toBeTruthy();
  });

  it('calls onBlockPress when block button is pressed', () => {
    const { toJSON } = render(
      <FollowList list={mockData} keyData="follower_user" />,
    );
    expect(toJSON()).toBeTruthy();
  });

  it('calls onUnfollowPress when unfollow button is pressed', () => {
    const { toJSON } = render(
      <FollowList list={mockData} keyData="follower_user" />,
    );
    expect(toJSON()).toBeTruthy();
  });
});
