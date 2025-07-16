import React from 'react';

import { render } from '@testing-library/react-native';

import PaymentMethodCard from '../PaymentMethodCard';

jest.mock('@/utils/getColor', () => ({
  getColor: jest.fn(() => '#000'),
}));

jest.mock('@expo/vector-icons', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { Text } = require('react-native');
  return {
    MaterialCommunityIcons: (props: Record<string, React.ReactNode>) => (
      <Text>{props.name}</Text>
    ),
  };
});

describe('PaymentMethodCard', () => {
  it('renders charged from label and card details', () => {
    const { getByText } = render(<PaymentMethodCard />);
    expect(getByText('Charged from')).toBeTruthy();
    expect(getByText('**** **** **** 2424')).toBeTruthy();
    expect(getByText('Expiry 02/26')).toBeTruthy();
  });

  it('shows next billing date if nextBilling is true', () => {
    const { getByText } = render(<PaymentMethodCard nextBilling />);
    expect(getByText('Next billing date 10/12/2025')).toBeTruthy();
  });

  it('applies custom className', () => {
    const { getByText } = render(
      <PaymentMethodCard className="custom-class" />,
    );
    expect(getByText('Charged from')).toBeTruthy();
  });
});
