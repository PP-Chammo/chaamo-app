import { fireEvent, render } from '@testing-library/react-native';

import BoughtOrder from '../BoughtOrder';
// Mock GraphQL generated module to avoid undefined enums
jest.mock('@/generated/graphql', () => ({
  OrderByDirection: { DESCNULLSLAST: 'DESCNULLSLAST' },
  OrderStatus: {
    AWAITING_PAYMENT: 'awaiting_payment',
    AWAITING_SHIPMENT: 'awaiting_shipment',
    SHIPPED: 'shipped',
    DELIVERED: 'delivered',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled',
    REFUNDED: 'refunded',
    REFUND_REQUESTED: 'refund_requested',
  },
  ListingType: { AUCTION: 'AUCTION', SELL: 'SELL' },
  CardCondition: { RAW: 'RAW', GRADED: 'GRADED' },
  useGetVwMyOrdersLazyQuery: jest.fn().mockReturnValue([
    jest.fn(),
    {
      data: {
        vw_myordersCollection: {
          edges: [
            {
              node: {
                id: '1',
                title: 'Test Product 1',
                final_price: 99.99,
                currency: 'USD',
                image_urls: 'https://example.com/image1.jpg',
                listing_id: 'listing-1',
                listing_type: 'SELL',
                status: 'awaiting_payment',
                created_at: '2023-01-01T00:00:00Z',
              },
            },
            {
              node: {
                id: '2',
                title: 'Test Product 2',
                final_price: 149.99,
                currency: 'USD',
                image_urls: 'https://example.com/image2.jpg',
                listing_id: 'listing-2',
                listing_type: 'SELL',
                status: 'completed',
                created_at: '2023-01-02T00:00:00Z',
              },
            },
          ],
        },
      },
      loading: false,
    },
  ]),
}));

jest.mock('@/constants/dummy', () => ({
  dummyOrders: [
    {
      id: 1,
      title: 'Test Product 1',
      price: '99.99',
      imageUrl: 'https://example.com/image1.jpg',
      status: 'progress',
    },
    {
      id: 2,
      title: 'Test Product 2',
      price: '149.99',
      imageUrl: 'https://example.com/image2.jpg',
      status: 'completed',
    },
  ],
}));

jest.mock('@/constants/tabs', () => ({
  ORDER_TABS_FILTER: [
    { label: 'Progress', value: 'progress' },
    { label: 'Completed', value: 'completed' },
  ],
}));

jest.mock('@/assets/svg', () => ({
  EmptyOrders: () => null,
}));

// Mock currency display to avoid external fetch and ensure fixed formatting
jest.mock('@/hooks/useCurrencyDisplay', () => ({
  useCurrencyDisplay: () => ({
    formatDisplay: (
      _currency: string | undefined,
      amount: number | string | undefined,
    ) => {
      const n = typeof amount === 'string' ? parseFloat(amount) : (amount ?? 0);
      return `$${(isNaN(n) ? 0 : n).toFixed(2)}`;
    },
  }),
}));

describe('BoughtOrder', () => {
  it('renders correctly with default state', () => {
    const { getByText } = render(<BoughtOrder />);

    expect(getByText('Progress')).toBeTruthy();
    expect(getByText('Completed')).toBeTruthy();
  });

  it('shows orders when data is available', () => {
    const { getByText } = render(<BoughtOrder />);

    expect(getByText('Test Product 1')).toBeTruthy();
    expect(getByText('$99.99')).toBeTruthy();
  });

  it('filters orders when tab is changed', () => {
    const { getByText } = render(<BoughtOrder />);

    fireEvent.press(getByText('Completed'));

    expect(getByText('Test Product 2')).toBeTruthy();
    expect(getByText('$149.99')).toBeTruthy();
  });

  it('handles filter changes correctly', () => {
    const { getByText } = render(<BoughtOrder />);

    expect(getByText('Test Product 1')).toBeTruthy();

    fireEvent.press(getByText('Completed'));
    expect(getByText('Test Product 2')).toBeTruthy();
  });
});
