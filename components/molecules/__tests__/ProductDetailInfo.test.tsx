import React from 'react';

import { render, screen } from '@testing-library/react-native';

import ProductDetailInfo from '../ProductDetailInfo';

jest.mock('@/generated/graphql', () => ({
  ...jest.requireActual('@/generated/graphql'),
  useUpdateUserCardMutation: jest.fn(() => [jest.fn(), { loading: false }]),
}));

describe('ProductDetailInfo', () => {
  const mockProps = {
    price: '$100',
    date: '2023-01-01',
    title: 'Test Product',
    marketPrice: '$120',
    description: 'This is a test product description',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with all props', () => {
    render(<ProductDetailInfo {...mockProps} />);

    expect(screen.getByText('Test Product')).toBeTruthy();
    expect(screen.getByText('This is a test product description')).toBeTruthy();
  });

  it('displays product title', () => {
    render(<ProductDetailInfo {...mockProps} />);

    expect(screen.getByText('Test Product')).toBeTruthy();
  });

  it('displays product description', () => {
    render(<ProductDetailInfo {...mockProps} />);

    expect(screen.getByText('This is a test product description')).toBeTruthy();
  });

  it('displays description title', () => {
    render(<ProductDetailInfo {...mockProps} />);

    expect(screen.getByText('Description')).toBeTruthy();
  });

  it('displays date information', () => {
    render(<ProductDetailInfo {...mockProps} />);

    expect(screen.getByText(/ago/)).toBeTruthy();
  });

  it('renders with all required elements', () => {
    render(<ProductDetailInfo {...mockProps} />);

    expect(screen.getByText('Test Product')).toBeTruthy();
    expect(screen.getByText('Description')).toBeTruthy();
    expect(screen.getByText('This is a test product description')).toBeTruthy();
  });

  it('handles Date object for date prop', () => {
    const propsWithDateObject = {
      ...mockProps,
      date: new Date('2023-01-01'),
    };

    render(<ProductDetailInfo {...propsWithDateObject} />);

    expect(screen.getByText(/ago/)).toBeTruthy();
  });

  it('displays eBay logo or text', () => {
    render(<ProductDetailInfo {...mockProps} />);
    expect(screen.getByText(/Price Value:/)).toBeTruthy();
  });
});
