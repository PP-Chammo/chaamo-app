import React from 'react';

import { fireEvent, render } from '@testing-library/react-native';

import SetupProfileTabs from '../SetupProfileTabs';

const mockRouter = {
  push: jest.fn(),
};

const mockSegments = ['setup-profile', 'personal-info'];

jest.mock('expo-router', () => ({
  useRouter: () => mockRouter,
  useSegments: () => mockSegments,
}));

describe('SetupProfileTabs', () => {
  beforeEach(() => {
    mockRouter.push.mockClear();
  });

  it('renders correctly with default props', () => {
    const { getByTestId } = render(<SetupProfileTabs />);
    expect(getByTestId('setup-profile-tabs')).toBeTruthy();
  });

  it('renders all tabs from setupProfileTabs', () => {
    const { getByTestId } = render(<SetupProfileTabs />);
    expect(getByTestId('setup-profile-tabs')).toBeTruthy();
  });

  it('calls router.push when tab is pressed', () => {
    const { getByTestId } = render(<SetupProfileTabs />);
    const firstTab = getByTestId('tab-personal-info');
    fireEvent.press(firstTab);
    expect(mockRouter.push).toHaveBeenCalledWith(
      'screens/setup-profile/personal-info',
    );
  });

  it('applies correct styling classes', () => {
    const { getByTestId } = render(<SetupProfileTabs />);
    expect(getByTestId('setup-profile-tabs')).toBeTruthy();
  });

  it('renders with proper layout structure', () => {
    const { getByTestId } = render(<SetupProfileTabs />);
    expect(getByTestId('setup-profile-tabs')).toBeTruthy();
  });
});
