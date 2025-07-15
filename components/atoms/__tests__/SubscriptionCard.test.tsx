import React from 'react';

import { render } from '@testing-library/react-native';

import SubscriptionCard from '../SubscriptionCard';
describe('SubscriptionCard', () => {
  it('renders correctly', () => {
    const { getByText } = render(<SubscriptionCard />);
    expect(getByText('Gold Subscription')).toBeTruthy();
    expect(getByText('$12.88/monthly')).toBeTruthy();
    expect(getByText('Next billing date 10/12/2025')).toBeTruthy();
  });
});
