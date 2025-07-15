import { fireEvent, render } from '@testing-library/react-native';

import SoldOrder from '../SoldOrder';

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
