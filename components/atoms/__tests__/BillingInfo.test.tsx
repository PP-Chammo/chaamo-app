import React from 'react';

import { render } from '@testing-library/react-native';

import PaymentMethodCard from '../BillingInfo';

describe('PaymentMethodCard (BillingInfo)', () => {
  it('renders billing info label and membership details', () => {
    const { getByText } = render(<PaymentMethodCard />);
    expect(getByText('Billing Info')).toBeTruthy();
    expect(getByText('Chaamo Gold Membership')).toBeTruthy();
    expect(getByText('$12.99/Monthly')).toBeTruthy();
  });

  it('applies custom className', () => {
    const { getByText } = render(
      <PaymentMethodCard className="custom-class" />,
    );
    expect(getByText('Billing Info')).toBeTruthy();
  });
});
