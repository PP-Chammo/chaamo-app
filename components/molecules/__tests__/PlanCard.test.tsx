import React from 'react';

import { render, screen } from '@testing-library/react-native';

import { MembershipType } from '@/generated/graphql';

import PlanCard, { PlanCardProps } from '../PlanCard';

describe('PlanCard', () => {
  const mockProps: PlanCardProps = {
    type: 'gold' as MembershipType,
    name: 'CHAAMO Gold Membership',
    description: "Enjoy complete access to CHAAMO's features!",
    subscriptionDays: 30,
    priceDisplay: '£9.56',
    benefits: [
      'Unlimited History',
      'Full Advance Valuation',
      'Unlimited cards & sealed products',
      'Unlimited alerts',
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with all props', () => {
    render(<PlanCard {...mockProps} />);

    expect(screen.getByText('Gold')).toBeTruthy();
    expect(screen.getByText('CHAAMO Gold Membership')).toBeTruthy();
    expect(screen.getByText(/£9\.56/)).toBeTruthy();
    expect(screen.getByText(/\/monthly/)).toBeTruthy();
    expect(screen.getByText('Benefits')).toBeTruthy();
  });

  it('displays plan type', () => {
    render(<PlanCard {...mockProps} />);

    expect(screen.getByText('Gold')).toBeTruthy();
  });

  it('displays membership title', () => {
    render(<PlanCard {...mockProps} />);

    expect(screen.getByText('CHAAMO Gold Membership')).toBeTruthy();
  });

  it('displays description', () => {
    render(<PlanCard {...mockProps} />);

    expect(screen.getByText(/Enjoy complete access/)).toBeTruthy();
  });

  it('displays price with monthly suffix', () => {
    render(<PlanCard {...mockProps} />);

    expect(screen.getByText(/£9\.56/)).toBeTruthy();
    expect(screen.getByText(/\/monthly/)).toBeTruthy();
  });

  it('displays benefits title', () => {
    render(<PlanCard {...mockProps} />);

    expect(screen.getByText('Benefits')).toBeTruthy();
  });

  it('displays all benefits with check icons', () => {
    render(<PlanCard {...mockProps} />);

    expect(screen.getByText('Unlimited History')).toBeTruthy();
    expect(screen.getByText('Full Advance Valuation')).toBeTruthy();
    expect(screen.getByText('Unlimited cards & sealed products')).toBeTruthy();
    expect(screen.getByText('Unlimited alerts')).toBeTruthy();
  });

  it('renders with all required elements', () => {
    render(<PlanCard {...mockProps} />);

    expect(screen.getByText('Gold')).toBeTruthy();
    expect(screen.getByText('CHAAMO Gold Membership')).toBeTruthy();
    expect(screen.getByText(/Enjoy complete access/)).toBeTruthy();
    expect(screen.getByText(/£9\.56/)).toBeTruthy();
    expect(screen.getByText('Benefits')).toBeTruthy();
  });

  it('handles different plan types', () => {
    const propsWithDifferentPlan = {
      ...mockProps,
      type: 'silver' as MembershipType,
      name: 'CHAAMO Silver Membership',
    };

    render(<PlanCard {...propsWithDifferentPlan} />);

    expect(screen.getByText('Silver')).toBeTruthy();
    expect(screen.getByText('CHAAMO Silver Membership')).toBeTruthy();
  });

  it('handles different price formats', () => {
    const propsWithDifferentPrice = {
      ...mockProps,
      priceDisplay: '£19.99',
    };

    render(<PlanCard {...propsWithDifferentPrice} />);

    expect(screen.getByText(/£19\.99/)).toBeTruthy();
  });

  it('handles empty benefits array', () => {
    const propsWithNoBenefits = {
      ...mockProps,
      benefits: [],
    };

    render(<PlanCard {...propsWithNoBenefits} />);

    expect(screen.getByText('Benefits')).toBeTruthy();
    expect(screen.queryByText('Unlimited History')).toBeNull();
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

    expect(screen.getByText('Unlimited History')).toBeTruthy();
    expect(screen.getByText('Full Advance Valuation')).toBeTruthy();
    expect(screen.getByText('Unlimited cards & sealed products')).toBeTruthy();
    expect(screen.getByText('Unlimited alerts')).toBeTruthy();
  });

  it('handles plan name with special characters', () => {
    const propsWithSpecialChars = {
      ...mockProps,
      name: 'CHAAMO Pro+ Membership',
    };

    render(<PlanCard {...propsWithSpecialChars} />);

    expect(screen.getByText('Gold')).toBeTruthy();
    expect(screen.getByText('CHAAMO Pro+ Membership')).toBeTruthy();
  });
});
