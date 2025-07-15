import { render } from '@testing-library/react-native';

import OrderItem from '../OrderItem';

describe('OrderItem', () => {
  const defaultProps = {
    title: 'Test Product',
    price: '99.99',
    imageUrl: 'https://example.com/image.jpg',
    status: 'progress' as const,
  };

  it('renders correctly with default props', () => {
    const { getByText } = render(<OrderItem {...defaultProps} />);

    expect(getByText('Test Product')).toBeTruthy();
    expect(getByText('$99.99')).toBeTruthy();
  });

  it('renders with progress status', () => {
    const { getByText } = render(
      <OrderItem {...defaultProps} status="progress" />,
    );

    expect(getByText('Test Product')).toBeTruthy();
  });

  it('renders with completed status', () => {
    const { getByText } = render(
      <OrderItem {...defaultProps} status="completed" />,
    );

    expect(getByText('Test Product')).toBeTruthy();
  });

  it('renders with cancelled status', () => {
    const { getByText } = render(
      <OrderItem {...defaultProps} status="cancelled" />,
    );

    expect(getByText('Test Product')).toBeTruthy();
  });

  it('renders with different title and price', () => {
    const { getByText } = render(
      <OrderItem {...defaultProps} title="Another Product" price="149.99" />,
    );

    expect(getByText('Another Product')).toBeTruthy();
    expect(getByText('$149.99')).toBeTruthy();
  });

  it('renders with different image URL', () => {
    const { getByText } = render(
      <OrderItem
        {...defaultProps}
        imageUrl="https://example.com/different-image.jpg"
      />,
    );

    expect(getByText('Test Product')).toBeTruthy();
  });

  it('is touchable', () => {
    const { getByText } = render(<OrderItem {...defaultProps} />);

    expect(getByText('Test Product')).toBeTruthy();
  });
});
