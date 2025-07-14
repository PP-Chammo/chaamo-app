import React from 'react';

import { render } from '@testing-library/react-native';

import PaymentMethodCard from '../PaymentMethodCard';
describe('PaymentMethodCard', () => {
  it('renders correctly', () => {
    const { getByText } = render(<PaymentMethodCard />);
    expect(getByText('Charged from')).toBeTruthy();
  });
  it('shows next billing date when nextBilling is true', () => {
    const { getByText } = render(<PaymentMethodCard nextBilling />);
    expect(getByText('Next billing date 10/12/2025')).toBeTruthy();
  });
});
