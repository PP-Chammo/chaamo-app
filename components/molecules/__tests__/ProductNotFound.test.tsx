import React from 'react';

import { render, fireEvent } from '@testing-library/react-native';
import { router } from 'expo-router';

import ProductNotFound from '../ProductNotFound';

jest.mock('expo-router', () => ({
  router: {
    back: jest.fn(),
  },
}));

describe('ProductNotFound', () => {
  it('renders correctly', () => {
    const { getByText } = render(<ProductNotFound />);
    expect(getByText('Uh-oh! We couldn`t find that')).toBeTruthy();
  });

  it('calls router.back when button is pressed', () => {
    const { getByText } = render(<ProductNotFound />);
    const button = getByText('Lets try using different keywords');
    fireEvent.press(button);
    expect(router.back).toHaveBeenCalled();
  });
});
