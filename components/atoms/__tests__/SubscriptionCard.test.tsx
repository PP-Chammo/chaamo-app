import React from 'react';

import { render } from '@testing-library/react-native';

import SubscriptionCard from '../SubscriptionCard';

jest.mock('@expo/vector-icons', () => {
  const { Text } = jest.requireActual('react-native');
  return {
    MaterialIcons: (props: Record<string, unknown>) => (
      <Text>{String(props.name)}</Text>
    ),
  };
});

jest.mock('@/utils/getColor', () => ({
  getColor: jest.fn(() => '#000'),
}));

describe('SubscriptionCard', () => {
  it('renders all subscription details and logo', () => {
    const { getByText } = render(<SubscriptionCard />);
    expect(getByText('Gold Subscription')).toBeTruthy();
    expect(getByText('$12.88/monthly')).toBeTruthy();
    expect(getByText('Next billing date 10/12/2025')).toBeTruthy();
    expect(getByText('chevron-right')).toBeTruthy();
  });
});
