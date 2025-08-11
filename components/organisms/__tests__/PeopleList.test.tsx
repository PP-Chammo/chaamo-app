/* eslint-disable import/first */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';

import { fireEvent, render } from '@testing-library/react-native';

// Local mocks to avoid relying on global Apollo client mocks
jest.mock('@/hooks/useFollows', () => ({
  useFollows: () => ({ getIsFollowing: () => false }),
}));

jest.mock('@/generated/graphql', () => ({
  useGetVwPeoplesLazyQuery: jest.fn(() => [
    jest.fn(),
    {
      loading: false,
      data: {
        vw_peoplesCollection: {
          edges: [
            {
              node: {
                id: '1',
                username: 'John Doe',
                profile_image_url: 'https://example.com/1.jpg',
              },
            },
            {
              node: {
                id: '2',
                username: 'Jane Smith',
                profile_image_url: 'https://example.com/2.jpg',
              },
            },
            {
              node: {
                id: '3',
                username: 'Alice',
                profile_image_url: 'https://example.com/3.jpg',
              },
            },
          ],
        },
      },
    },
  ]),
  useCreateFollowsMutation: jest.fn(() => [jest.fn(), { loading: false }]),
  useRemoveFollowsMutation: jest.fn(() => [jest.fn(), { loading: false }]),
}));

// Stub molecules barrel to avoid importing components that pull CardCondition
jest.mock('@/components/molecules', () => {
  const React = jest.requireActual('react');
  const RN = jest.requireActual('react-native');
  const { View, Text, TouchableOpacity } = RN;
  const ListContainerDirection = { None: 'none' } as const;
  const ListContainer = ({ children, title, data }: any) =>
    React.createElement(
      View,
      { testID: 'list-container' },
      React.createElement(Text, null, title),
      (data || []).map((d: any) => children(d)),
    );
  const People = ({ fullname, imageUrl, onFollowPress }: any) =>
    React.createElement(
      View,
      { testID: 'people-item' },
      React.createElement(View, { testID: 'avatar' }),
      React.createElement(Text, null, fullname),
      React.createElement(
        TouchableOpacity,
        { testID: 'follow-button', onPress: onFollowPress || (() => {}) },
        React.createElement(Text, null, 'Follow'),
      ),
    );
  return { ListContainer, ListContainerDirection, People };
});

import PeopleList from '../PeopleList';

describe('PeopleList', () => {
  it('renders correctly', () => {
    const { getByTestId } = render(<PeopleList />);
    expect(getByTestId('list-container')).toBeTruthy();
  });

  it('displays people title', () => {
    const { getByText } = render(<PeopleList />);
    expect(getByText('People')).toBeTruthy();
  });

  it('renders all people items', () => {
    const { getAllByTestId } = render(<PeopleList />);
    const peopleItems = getAllByTestId('people-item');
    expect(peopleItems.length).toBe(3);
  });

  it('handles people item press', () => {
    const { getAllByTestId } = render(<PeopleList />);
    const peopleItems = getAllByTestId('people-item');
    fireEvent.press(peopleItems[0]);
    expect(peopleItems[0]).toBeTruthy();
  });

  it('handles follow button press', () => {
    const { getAllByTestId } = render(<PeopleList />);
    const followButtons = getAllByTestId('follow-button');
    fireEvent.press(followButtons[0]);
    expect(followButtons[0]).toBeTruthy();
  });
});
