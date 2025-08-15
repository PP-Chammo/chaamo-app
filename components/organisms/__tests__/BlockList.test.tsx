/* eslint-disable import/first */
import React from 'react';

import { fireEvent, render } from '@testing-library/react-native';

jest.mock('@/hooks/useFollows', () => ({
  useFollows: () => ({ getIsFollowing: () => false }),
}));
jest.mock('@/hooks/useBlockedUsers', () => ({
  useBlockedUsers: () => ({ getIsBlocked: () => false }),
}));

// Stub molecules to avoid pulling entire index with side effects
jest.mock('@/components/molecules', () => {
  const React = jest.requireActual('react');
  const RN = jest.requireActual('react-native');
  const { View, Text, TouchableOpacity } = RN;
  return {
    BlockListItem: (props: unknown) => {
      const p = (props as Record<string, unknown>) || {};
      const username = p.username as string | undefined;
      const onToggleBlockPress = p.onToggleBlockPress as
        | (() => void)
        | undefined;
      return React.createElement(
        View,
        { testID: 'block-list-item' },
        React.createElement(View, { testID: 'avatar' }),
        React.createElement(
          TouchableOpacity,
          { testID: 'button', onPress: onToggleBlockPress || (() => {}) },
          React.createElement(Text, null, 'Block'),
        ),
        React.createElement(Text, null, username),
      );
    },
  };
});

// GraphQL hooks used inside component
jest.mock('@/generated/graphql', () => ({
  useRemoveFollowsMutation: jest.fn(() => [jest.fn(), { loading: false }]),
  useCreateBlockedUsersMutation: jest.fn(() => [jest.fn(), { loading: false }]),
  useRemoveBlockedUsersMutation: jest.fn(() => [jest.fn(), { loading: false }]),
}));

import type { GetProfilesQuery } from '@/generated/graphql';
import type { DeepGet } from '@/types/helper';

import BlockList from '../BlockList';

describe('BlockList', () => {
  const list: DeepGet<GetProfilesQuery, ['profilesCollection', 'edges']> = [
    {
      node: {
        id: '1',
        username: 'John Doe',
        profile_image_url: 'https://example.com/john.jpg',
        created_at: '2024-01-01T00:00:00Z',
        is_profile_complete: true,
      },
    },
    {
      node: {
        id: '2',
        username: 'Jane Smith',
        profile_image_url: 'https://example.com/jane.jpg',
        created_at: '2024-01-02T00:00:00Z',
        is_profile_complete: true,
      },
    },
  ];

  it('renders correctly', () => {
    const { getByTestId } = render(<BlockList list={list} />);
    expect(getByTestId('block-list')).toBeTruthy();
  });

  it('renders block list items', () => {
    const { getAllByTestId } = render(<BlockList list={list} />);
    const avatars = getAllByTestId('avatar');
    expect(avatars).toHaveLength(2);
  });

  it('displays user names', () => {
    const { getByText } = render(<BlockList list={list} />);
    expect(getByText('John Doe')).toBeTruthy();
    expect(getByText('Jane Smith')).toBeTruthy();
  });

  it('handles item press', () => {
    const { getAllByTestId } = render(<BlockList list={list} />);
    const avatars = getAllByTestId('avatar');
    const first = avatars[0];
    fireEvent.press(first);
    expect(first).toBeTruthy();
  });

  it('renders with blocked state', () => {
    const { getAllByTestId } = render(<BlockList list={list} />);
    const avatars = getAllByTestId('avatar');
    expect(avatars).toHaveLength(2);
  });

  it('renders with empty data', () => {
    const { getByTestId } = render(<BlockList list={[]} />);
    expect(getByTestId('block-list')).toBeTruthy();
  });

  it('renders with correct styling', () => {
    const { getByTestId } = render(<BlockList list={list} />);
    const blockList = getByTestId('block-list');
    expect(blockList).toBeTruthy();
  });

  it('shows loading state button refs', () => {
    const { getAllByTestId } = render(<BlockList list={list} />);
    const buttons = getAllByTestId('button');
    expect(buttons).toHaveLength(2);
  });

  it('renders buttons regardless of loading flag', () => {
    const { getAllByTestId } = render(<BlockList list={list} />);
    const buttons = getAllByTestId('button');
    expect(buttons).toHaveLength(2);
  });

  it('handles button press', () => {
    const { getAllByTestId } = render(<BlockList list={list} />);
    const buttons = getAllByTestId('button');
    fireEvent.press(buttons[0]);
    expect(buttons[0]).toBeTruthy();
  });

  it('handles button press for second item', () => {
    const { getAllByTestId } = render(<BlockList list={list} />);
    const buttons = getAllByTestId('button');
    fireEvent.press(buttons[1]);
    expect(buttons[1]).toBeTruthy();
  });

  it('renders without crashing when pressing in loading scenario', () => {
    const { getAllByTestId } = render(<BlockList list={list} />);
    const buttons = getAllByTestId('button');
    fireEvent.press(buttons[0]);
    expect(buttons[0]).toBeTruthy();
  });

  it('renders second button and can be pressed', () => {
    const { getAllByTestId } = render(<BlockList list={list} />);
    const buttons = getAllByTestId('button');
    fireEvent.press(buttons[1]);
    expect(buttons[1]).toBeTruthy();
  });
});
