import { fireEvent, render } from '@testing-library/react-native';

import SoldOrder from '../SoldOrder';

// Mock GraphQL generated module to avoid undefined enums and hooks
jest.mock('@/generated/graphql', () => ({
  OrderByDirection: { DESCNULLSLAST: 'DESCNULLSLAST' },
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
  ListingType: { AUCTION: 'AUCTION', SELL: 'SELL' },
  CardCondition: { RAW: 'RAW', GRADED: 'GRADED' },
  useGetVwMyOrdersQuery: jest.fn().mockReturnValue({
    data: {
      vw_myordersCollection: {
        edges: [
          {
            node: {
              id: '1',
              title: 'Test Product 1',
              seller_earnings: 99.99,
              currency: 'USD',
              status: 'AWAITING_PAYMENT',
              created_at: '2023-01-01T00:00:00Z',
              listing_id: 'listing-1',
              listing_type: 'SELL',
              image_urls: '',
            },
          },
          {
            node: {
              id: '2',
              title: 'Test Product 2',
              seller_earnings: 149.99,
              currency: 'USD',
              status: 'COMPLETED',
              created_at: '2023-01-02T00:00:00Z',
              listing_id: 'listing-2',
              listing_type: 'SELL',
              image_urls: '',
            },
          },
        ],
      },
    },
    loading: false,
  }),
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

describe('SoldOrder', () => {
  it('renders correctly with default state', () => {
    const { getByText } = render(<SoldOrder />);

    expect(getByText('Progress')).toBeTruthy();
    expect(getByText('Completed')).toBeTruthy();
  });

  it('shows orders when data is available', () => {
    const { getByText } = render(<SoldOrder />);

    expect(getByText('Test Product 1')).toBeTruthy();
    expect(getByText('$99.99')).toBeTruthy();
  });

  it('filters orders when tab is changed', () => {
    const { getByText } = render(<SoldOrder />);

    fireEvent.press(getByText('Completed'));

    expect(getByText('Test Product 2')).toBeTruthy();
    expect(getByText('$149.99')).toBeTruthy();
  });

  it('handles filter changes correctly', () => {
    const { getByText } = render(<SoldOrder />);

    expect(getByText('Test Product 1')).toBeTruthy();

    fireEvent.press(getByText('Completed'));
    expect(getByText('Test Product 2')).toBeTruthy();
  });
});
