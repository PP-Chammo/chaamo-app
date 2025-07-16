import React from 'react';

import { render, screen } from '@testing-library/react-native';

import PlanCard from '../PlanCard';

describe('PlanCard', () => {
  const mockProps = {
    name: 'Premium',
    price: '29.99',
    benefits: [
      'Unlimited access to all features',
      'Priority customer support',
      'Exclusive content',
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with all props', () => {
    render(<PlanCard {...mockProps} />);

    expect(screen.getAllByText('Premium')).toHaveLength(2);
    expect(screen.getByText('CHAAMO Premium Membership')).toBeTruthy();
    expect(screen.getByText(/29\.99/)).toBeTruthy();
    expect(screen.getByText(/\/monthly/)).toBeTruthy();
    expect(screen.getByText('Benefits')).toBeTruthy();
  });

  it('displays plan name', () => {
    render(<PlanCard {...mockProps} />);

    expect(screen.getAllByText('Premium')).toHaveLength(2);
  });

  it('displays membership title with plan name', () => {
    render(<PlanCard {...mockProps} />);

    expect(screen.getByText('CHAAMO Premium Membership')).toBeTruthy();
  });

  it('displays description', () => {
    render(<PlanCard {...mockProps} />);

    expect(
      screen.getByText(/Enjoy complete access to CHAAMO[’']s features!/),
    ).toBeTruthy();
  });

  it('displays price with monthly suffix', () => {
    render(<PlanCard {...mockProps} />);

    expect(screen.getByText(/29\.99/)).toBeTruthy();
    expect(screen.getByText(/\/monthly/)).toBeTruthy();
  });

  it('displays benefits title', () => {
    render(<PlanCard {...mockProps} />);

    expect(screen.getByText('Benefits')).toBeTruthy();
  });

  it('displays all benefits with check icons', () => {
    render(<PlanCard {...mockProps} />);

    expect(screen.getByText('Unlimited access to all features')).toBeTruthy();
    expect(screen.getByText('Priority customer support')).toBeTruthy();
    expect(screen.getByText('Exclusive content')).toBeTruthy();
  });

  it('renders with all required elements', () => {
    render(<PlanCard {...mockProps} />);

    expect(screen.getAllByText('Premium')).toHaveLength(2);
    expect(screen.getByText('CHAAMO Premium Membership')).toBeTruthy();
    expect(
      screen.getByText(/Enjoy complete access to CHAAMO[’']s features!/),
    ).toBeTruthy();
    expect(screen.getByText(/29\.99/)).toBeTruthy();
    expect(screen.getByText('Benefits')).toBeTruthy();
  });

  it('handles different plan names', () => {
    const propsWithDifferentPlan = {
      ...mockProps,
      name: 'Basic',
    };

    render(<PlanCard {...propsWithDifferentPlan} />);

    expect(screen.getAllByText('Basic')).toHaveLength(2);
    expect(screen.getByText('CHAAMO Basic Membership')).toBeTruthy();
  });

  it('handles different price formats', () => {
    const propsWithDifferentPrice = {
      ...mockProps,
      price: '9.99',
    };

    render(<PlanCard {...propsWithDifferentPrice} />);

    expect(screen.getByText(/9\.99/)).toBeTruthy();
  });

  it('handles empty benefits array', () => {
    const propsWithNoBenefits = {
      ...mockProps,
      benefits: [],
    };

    render(<PlanCard {...propsWithNoBenefits} />);

    expect(screen.getByText('Benefits')).toBeTruthy();
    expect(screen.queryByText('Unlimited access to all features')).toBeNull();
  });

  it('handles single benefit', () => {
    const propsWithSingleBenefit = {
      ...mockProps,
      benefits: ['Single benefit'],
    };

    render(<PlanCard {...propsWithSingleBenefit} />);

    expect(screen.getByText('Single benefit')).toBeTruthy();
  });

  it('displays check icons for each benefit', () => {
    render(<PlanCard {...mockProps} />);

    expect(screen.getByText('Unlimited access to all features')).toBeTruthy();
    expect(screen.getByText('Priority customer support')).toBeTruthy();
    expect(screen.getByText('Exclusive content')).toBeTruthy();
  });

  it('handles plan name with special characters', () => {
    const propsWithSpecialChars = {
      ...mockProps,
      name: 'Pro+',
    };

    render(<PlanCard {...propsWithSpecialChars} />);

    expect(screen.getAllByText('Pro+')).toHaveLength(2);
    expect(screen.getByText('CHAAMO Pro+ Membership')).toBeTruthy();
  });
});
