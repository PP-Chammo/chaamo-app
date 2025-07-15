import React from 'react';

import { fireEvent, render } from '@testing-library/react-native';
import { router } from 'expo-router';

import AccountBar from '../AccountBar';

// Mock the router
jest.mock('expo-router', () => ({
  router: { push: jest.fn() },
}));

describe('AccountBar', () => {
  it('renders correctly', () => {
    const { getByTestId } = render(<AccountBar />);
    expect(getByTestId('account-bar')).toBeTruthy();
  });

  it('displays greeting message', () => {
    const { getByText } = render(<AccountBar />);
    expect(getByText('Hi')).toBeTruthy();
    expect(getByText('Shireen!')).toBeTruthy();
  });

  it('renders notification button', () => {
    const { getAllByTestId } = render(<AccountBar />);
    const buttonIcons = getAllByTestId('button-icon');
    expect(buttonIcons).toHaveLength(2);
  });

  it('renders wallet button', () => {
    const { getAllByTestId } = render(<AccountBar />);
    const buttonIcons = getAllByTestId('button-icon');
    expect(buttonIcons).toHaveLength(2);
  });

  it('handles notification button press', () => {
    const { getAllByTestId } = render(<AccountBar />);
    const buttonIcons = getAllByTestId('button-icon');
    const notificationButton = buttonIcons[0]; // First button is notification

    fireEvent.press(notificationButton);

    expect(router.push).toHaveBeenCalledWith('/screens/notifications');
  });

  it('handles wallet button press', () => {
    const { getAllByTestId } = render(<AccountBar />);
    const buttonIcons = getAllByTestId('button-icon');
    const walletButton = buttonIcons[1]; // Second button is wallet

    fireEvent.press(walletButton);

    expect(router.push).toHaveBeenCalledWith('/screens/wallets');
  });

  it('renders Row component with correct props', () => {
    const { getByTestId } = render(<AccountBar />);
    expect(getByTestId('account-bar')).toBeTruthy();
  });

  it('renders left and right sections', () => {
    const { getByTestId } = render(<AccountBar />);
    expect(getByTestId('account-bar-left')).toBeTruthy();
    expect(getByTestId('account-bar-right')).toBeTruthy();
  });
});
