import React from 'react';

import { render } from '@testing-library/react-native';

import SubscriptionCard, { SubscriptionCardProps } from '../SubscriptionCard';

jest.mock('@/components/atoms/Icon', () => {
  const { Text } = jest.requireActual('react-native');
  const MockIcon = (props: Record<string, unknown>) => (
    <Text>{props.name}</Text>
  );
  MockIcon.displayName = 'MockIcon';
  return MockIcon;
});

jest.mock('@/utils/getColor', () => ({
  getColor: jest.fn(() => '#123456'),
}));

describe('SubscriptionCard (molecules)', () => {
  const baseProps: SubscriptionCardProps = {
    name: 'Gold',
    price: '12.99',
    benefits: ['Benefit 1', 'Benefit 2'],
  };

  it('renders all main labels and price', () => {
    const { getAllByText, getByText } = render(
      <SubscriptionCard {...baseProps} />,
    );
    expect(getAllByText('Gold').length).toBeGreaterThan(0);
    expect(getAllByText(/CHAAMO/).length).toBeGreaterThan(0);
    expect(getAllByText(/Membership/).length).toBeGreaterThan(0);
    expect(
      getByText('Enjoy complete access to CHAAMO’s features!'),
    ).toBeTruthy();
    expect(getByText(/\$12\.99/)).toBeTruthy();
    expect(getByText(/\/monthly/)).toBeTruthy();
    expect(getByText('Benefits')).toBeTruthy();
  });

  it('renders all benefits', () => {
    const { getByText } = render(<SubscriptionCard {...baseProps} />);
    expect(getByText('Benefit 1')).toBeTruthy();
    expect(getByText('Benefit 2')).toBeTruthy();
  });

  it('renders Icon for each benefit', () => {
    const { getAllByText } = render(<SubscriptionCard {...baseProps} />);
    // There should be one 'check' icon per benefit
    expect(getAllByText('check').length).toBe(baseProps.benefits.length);
  });

  it('renders correctly with empty benefits', () => {
    const { getByText, queryByText } = render(
      <SubscriptionCard {...baseProps} benefits={[]} />,
    );
    expect(getByText('Benefits')).toBeTruthy();
    expect(queryByText('check')).toBeNull();
  });

  it('renders correctly with a single benefit', () => {
    const { getByText, getAllByText } = render(
      <SubscriptionCard {...baseProps} benefits={['Only Benefit']} />,
    );
    expect(getByText('Only Benefit')).toBeTruthy();
    expect(getAllByText('check').length).toBe(1);
  });
});
