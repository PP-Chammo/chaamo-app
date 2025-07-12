import { render, fireEvent } from '@testing-library/react-native';

import BoughtOrder from '../BoughtOrder';

// Mock the constants and dummy data
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

describe('BoughtOrder', () => {
  it('renders correctly with default state', () => {
    const { getByText } = render(<BoughtOrder />);

    // Should show the filter tabs
    expect(getByText('Progress')).toBeTruthy();
    expect(getByText('Completed')).toBeTruthy();
  });

  it('shows orders when data is available', () => {
    const { getByText } = render(<BoughtOrder />);

    // Should show the first order (progress status is selected by default)
    expect(getByText('Test Product 1')).toBeTruthy();
    expect(getByText('$99.99')).toBeTruthy();
  });

  it('filters orders when tab is changed', () => {
    const { getByText } = render(<BoughtOrder />);

    // Click on completed tab
    fireEvent.press(getByText('Completed'));

    // Should show the completed order
    expect(getByText('Test Product 2')).toBeTruthy();
    expect(getByText('$149.99')).toBeTruthy();
  });

  it('handles filter changes correctly', () => {
    const { getByText } = render(<BoughtOrder />);

    // Initially should show progress orders
    expect(getByText('Test Product 1')).toBeTruthy();

    // Change to completed filter
    fireEvent.press(getByText('Completed'));
    expect(getByText('Test Product 2')).toBeTruthy();
  });
});
