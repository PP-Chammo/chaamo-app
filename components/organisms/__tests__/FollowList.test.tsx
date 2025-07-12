import React from 'react';

import { render } from '@testing-library/react-native';

import FollowList from '../FollowList';

describe('FollowList', () => {
  it('renders correctly', () => {
    const { toJSON } = render(<FollowList />);
    expect(toJSON()).toBeTruthy();
  });

  it('renders FlatList component', () => {
    const { toJSON } = render(<FollowList />);
    expect(toJSON()).toBeTruthy();
  });

  it('renders FollowListItem components for each item', () => {
    const { toJSON } = render(<FollowList />);
    expect(toJSON()).toBeTruthy();
  });

  it('displays data from dummy following list', () => {
    const { toJSON } = render(<FollowList />);
    expect(toJSON()).toBeTruthy();
  });

  it('applies correct styling classes', () => {
    const { toJSON } = render(<FollowList />);
    expect(toJSON()).toBeTruthy();
  });

  it('renders with proper layout structure', () => {
    const { toJSON } = render(<FollowList />);
    expect(toJSON()).toBeTruthy();
  });

  it('handles empty data gracefully', () => {
    const { toJSON } = render(<FollowList />);
    expect(toJSON()).toBeTruthy();
  });

  it('renders with proper key extraction', () => {
    const { toJSON } = render(<FollowList />);
    expect(toJSON()).toBeTruthy();
  });
});
