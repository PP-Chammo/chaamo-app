import React from 'react';

import { render } from '@testing-library/react-native';

import StatsProfile from '../StatsProfile';

describe('StatsProfile', () => {
  it('renders correctly', () => {
    const { getByTestId } = render(<StatsProfile />);
    expect(getByTestId('stats-profile')).toBeTruthy();
  });

  it('displays portfolio listings stat', () => {
    const { getByText } = render(<StatsProfile />);
    expect(getByText('Portfolio Listings')).toBeTruthy();
  });

  it('displays sold items stat', () => {
    const { getByText } = render(<StatsProfile />);
    expect(getByText('Sold Items')).toBeTruthy();
  });

  it('displays auction items stat', () => {
    const { getByText } = render(<StatsProfile />);
    expect(getByText('Auction Items')).toBeTruthy();
  });

  it('displays buy now items stat', () => {
    const { getByText } = render(<StatsProfile />);
    expect(getByText('Buy Now Items')).toBeTruthy();
  });

  it('displays total earnings stat', () => {
    const { getByText } = render(<StatsProfile />);
    expect(getByText('Total Earnings')).toBeTruthy();
  });

  it('displays correct stats values', () => {
    const { getByTestId } = render(<StatsProfile />);
    expect(getByTestId('portfolio').props.children[0][0].props.children).toBe(
      '1',
    );
    expect(getByTestId('sold').props.children[0][0].props.children).toBe('1');
    expect(getByTestId('auction').props.children[0][0].props.children).toBe(
      '1',
    );
    expect(getByTestId('buy-now').props.children[0][0].props.children).toBe(
      '2',
    );
    expect(
      getByTestId('total-earnings').props.children[0][0].props.children,
    ).toBe('$300');
  });

  it('displays location information', () => {
    const { getByText } = render(<StatsProfile />);
    expect(getByText('Location')).toBeTruthy();
    expect(getByText('London, UK')).toBeTruthy();
  });

  it('displays member since information', () => {
    const { getByText } = render(<StatsProfile />);
    expect(getByText('member since: Jul 24, 2025')).toBeTruthy();
  });

  it('renders location icon', () => {
    const { getByTestId } = render(<StatsProfile />);
    expect(getByTestId('location-icon')).toBeTruthy();
  });

  it('displays all required stats with correct structure', () => {
    const { getByText, getAllByText } = render(<StatsProfile />);

    const statLabels = [
      'Portfolio Listings',
      'Sold Items',
      'Auction Items',
      'Buy Now Items',
      'Total Earnings',
    ];
    statLabels.forEach((label) => {
      expect(getByText(label)).toBeTruthy();
    });

    const statValues = getAllByText(/\d+/);
    expect(statValues.length).toBeGreaterThanOrEqual(4);
  });
});
