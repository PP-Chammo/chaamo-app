import React from 'react';

import { render } from '@testing-library/react-native';

import BillingInfo from '../BillingInfo';

describe('BillingInfo', () => {
  const mockProps = {
    name: 'Chaamo Gold Membership',
    subscriptionInfo: '$12.99/Monthly',
  };

  it('renders billing info label and membership details', () => {
    const { getByText } = render(<BillingInfo {...mockProps} />);
    expect(getByText('Billing Info')).toBeTruthy();
    expect(getByText('Chaamo Gold Membership')).toBeTruthy();
    expect(getByText('$12.99/Monthly')).toBeTruthy();
  });

  it('applies custom className', () => {
    const { getByText } = render(
      <BillingInfo {...mockProps} className="custom-class" />,
    );
    expect(getByText('Billing Info')).toBeTruthy();
  });
});
