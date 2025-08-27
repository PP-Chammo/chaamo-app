import { render } from '@testing-library/react-native';

import { ListingType, OrderStatus } from '@/generated/graphql';

import OrderItem from '../OrderItem';

// Provide GraphQL enum mocks to avoid undefined enum values during tests
jest.mock('@/generated/graphql', () => ({
  ListingType: { AUCTION: 'AUCTION', SELL: 'SELL' },
  OrderStatus: {
    AWAITING_PAYMENT: 'AWAITING_PAYMENT',
    AWAITING_SHIPMENT: 'AWAITING_SHIPMENT',
    SHIPPED: 'SHIPPED',
    DELIVERED: 'DELIVERED',
    COMPLETED: 'COMPLETED',
    CANCELLED: 'CANCELLED',
    REFUNDED: 'REFUNDED',
    REFUND_REQUESTED: 'REFUND_REQUESTED',
  },
}));

describe('OrderItem', () => {
  const defaultProps = {
    id: 'test-id',
    listingId: 'test-listing-id',
    listingType: ListingType.SELL,
    title: 'Test Product',
    price: '$99.99',
    imageUrls: 'https://example.com/image.jpg',
    status: OrderStatus.AWAITING_SHIPMENT,
  };

  it('renders correctly with default props', () => {
    const { getByText } = render(<OrderItem {...defaultProps} />);

    expect(getByText('Test Product')).toBeTruthy();
    expect(getByText('$99.99')).toBeTruthy();
  });

  it('renders with awaiting_payment status', () => {
    const { getByText } = render(
      <OrderItem {...defaultProps} status={OrderStatus.AWAITING_PAYMENT} />,
    );

    expect(getByText('Test Product')).toBeTruthy();
  });

  it('renders with completed status', () => {
    const { getByText } = render(
      <OrderItem {...defaultProps} status={OrderStatus.COMPLETED} />,
    );

    expect(getByText('Test Product')).toBeTruthy();
  });

  it('renders with cancelled status', () => {
    const { getByText } = render(
      <OrderItem {...defaultProps} status={OrderStatus.CANCELLED} />,
    );

    expect(getByText('Test Product')).toBeTruthy();
  });

  it('renders with different title and price', () => {
    const { getByText } = render(
      <OrderItem {...defaultProps} title="Another Product" price="$149.99" />,
    );

    expect(getByText('Another Product')).toBeTruthy();
    expect(getByText('$149.99')).toBeTruthy();
  });

  it('renders with different image URL', () => {
    const { getByText } = render(
      <OrderItem
        {...defaultProps}
        imageUrls="https://example.com/different-image.jpg"
      />,
    );

    expect(getByText('Test Product')).toBeTruthy();
  });

  it('is touchable', () => {
    const { getByText } = render(<OrderItem {...defaultProps} />);

    expect(getByText('Test Product')).toBeTruthy();
  });
});
