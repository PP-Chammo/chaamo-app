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
    MaterialIcons: (props: Record<string, React.ReactNode>) => (
      <Text>{props.name}</Text>
    ),
  };
});

describe('PaymentMethodCard', () => {
  const mockProps = {
    name: 'Visa',
    subscriptionInfo: {
      last4: '1234',
      expiry: 'MM/YY',
    },
  };

  it('renders charged from label and card details', () => {
    const { getByText } = render(<PaymentMethodCard {...mockProps} />);
    expect(getByText('Charged from')).toBeTruthy();
    expect(getByText('**** **** **** 1234')).toBeTruthy();
    expect(getByText('Expiry MM/YY')).toBeTruthy();
  });

  it('shows next billing date if nextBillingDate is provided', () => {
    const { getByText } = render(
      <PaymentMethodCard {...mockProps} nextBillingDate="2025-10-12" />,
    );
    expect(getByText('Next billing date 12/10/2025')).toBeTruthy();
  });

  it('applies custom className', () => {
    const { getByText } = render(
      <PaymentMethodCard {...mockProps} className="custom-class" />,
    );
    expect(getByText('Charged from')).toBeTruthy();
  });
});
