import React from 'react';

import { render } from '@testing-library/react-native';

import PriceIndicator from '../PriceIndicator';

jest.mock('@/components/atoms', () => {
  const { Text } = jest.requireActual('react-native');
  return {
    Icon: (props: Record<string, unknown>) => (
      <Text>{`${props.name}-${props.color}-${props.size}`}</Text>
    ),
  };
});

jest.mock('@/utils/getColor', () => ({
  getColor: jest.fn((color) => color),
}));

describe('PriceIndicator', () => {
  it('renders trending-up icon with primary color when direction is up', () => {
    const { getByText } = render(<PriceIndicator direction="up" />);
    expect(getByText('trending-up-primary-500-16')).toBeTruthy();
  });

  it('renders trending-down icon with red color when direction is down', () => {
    const { getByText } = render(<PriceIndicator direction="down" />);
    expect(getByText('trending-down-red-600-16')).toBeTruthy();
  });

  it('applies custom size', () => {
    const { getByText } = render(<PriceIndicator direction="up" size={32} />);
    expect(getByText('trending-up-primary-500-32')).toBeTruthy();
  });
});
