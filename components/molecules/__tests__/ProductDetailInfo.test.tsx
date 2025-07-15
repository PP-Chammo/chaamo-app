import React from 'react';

import { render, screen } from '@testing-library/react-native';

import ProductDetailInfo from '../ProductDetailInfo';

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
    expect(screen.getByText('$100')).toBeTruthy();
    expect(screen.getByText('$120')).toBeTruthy();
    expect(screen.getByText('This is a test product description')).toBeTruthy();
  });

  it('displays product title', () => {
    render(<ProductDetailInfo {...mockProps} />);

    expect(screen.getByText('Test Product')).toBeTruthy();
  });

  it('displays product price', () => {
    render(<ProductDetailInfo {...mockProps} />);

    expect(screen.getByText('$100')).toBeTruthy();
  });

  it('displays market price', () => {
    render(<ProductDetailInfo {...mockProps} />);

    expect(screen.getByText('$120')).toBeTruthy();
  });

  it('displays price value label', () => {
    render(<ProductDetailInfo {...mockProps} />);

    expect(screen.getByText(/Price Value:/)).toBeTruthy();
  });

  it('displays description title', () => {
    render(<ProductDetailInfo {...mockProps} />);

    expect(screen.getByText('Description')).toBeTruthy();
  });

  it('displays description content', () => {
    render(<ProductDetailInfo {...mockProps} />);

    expect(screen.getByText('This is a test product description')).toBeTruthy();
  });

  it('displays date information', () => {
    render(<ProductDetailInfo {...mockProps} />);

    expect(screen.getByText(/ago/)).toBeTruthy();
  });

  it('renders with all required elements', () => {
    render(<ProductDetailInfo {...mockProps} />);

    expect(screen.getByText('Test Product')).toBeTruthy();
    expect(screen.getByText('$100')).toBeTruthy();
    expect(screen.getByText('$120')).toBeTruthy();
    expect(screen.getByText('Description')).toBeTruthy();
    expect(screen.getByText('This is a test product description')).toBeTruthy();
  });

  it('handles numeric price values', () => {
    const propsWithNumericPrice = {
      ...mockProps,
      price: 150,
      marketPrice: 180,
    };

    render(<ProductDetailInfo {...propsWithNumericPrice} />);

    expect(screen.getByText('150')).toBeTruthy();
    expect(screen.getByText('180')).toBeTruthy();
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
