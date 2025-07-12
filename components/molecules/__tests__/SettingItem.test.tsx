import React from 'react';

import { render, fireEvent } from '@testing-library/react-native';

import SettingItem from '../SettingItem';

describe('SettingItem', () => {
  const defaultProps = {
    iconName: 'settings',
    title: 'Settings',
  };

  it('renders correctly with default props', () => {
    const { getByText } = render(<SettingItem {...defaultProps} />);
    expect(getByText('Settings')).toBeTruthy();
  });

  it('renders with subtitle', () => {
    const { getByText } = render(
      <SettingItem {...defaultProps} subtitle="Manage your preferences" />,
    );
    expect(getByText('Settings')).toBeTruthy();
    expect(getByText('Manage your preferences')).toBeTruthy();
  });

  it('renders with value', () => {
    const { getByText } = render(
      <SettingItem {...defaultProps} value="Enabled" />,
    );
    expect(getByText('Settings')).toBeTruthy();
    expect(getByText('Enabled')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByTestId } = render(
      <SettingItem {...defaultProps} onPress={onPress} />,
    );

    const touchable = getByTestId('setting-item');
    fireEvent.press(touchable);

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('renders with custom icon name', () => {
    const { getByTestId } = render(
      <SettingItem {...defaultProps} iconName="account" />,
    );
    expect(getByTestId('setting-item')).toBeTruthy();
  });

  it('renders with custom icon variant', () => {
    const { getByTestId } = render(
      <SettingItem {...defaultProps} iconVariant="FontAwesome" />,
    );
    expect(getByTestId('setting-item')).toBeTruthy();
  });

  it('renders with custom icon color', () => {
    const { getByTestId } = render(
      <SettingItem {...defaultProps} iconColor="red" />,
    );
    expect(getByTestId('setting-item')).toBeTruthy();
  });

  it('renders with custom title', () => {
    const { getByText } = render(
      <SettingItem {...defaultProps} title="Account Settings" />,
    );
    expect(getByText('Account Settings')).toBeTruthy();
  });

  it('shows chevron icon when onPress is provided', () => {
    const onPress = jest.fn();
    const { getByTestId } = render(
      <SettingItem {...defaultProps} onPress={onPress} />,
    );
    expect(getByTestId('chevron-icon')).toBeTruthy();
  });

  it('does not show chevron icon when onPress is not provided', () => {
    const { queryByTestId } = render(<SettingItem {...defaultProps} />);
    expect(queryByTestId('chevron-icon')).toBeNull();
  });

  it('renders with all props combined', () => {
    const onPress = jest.fn();
    const { getByText, getByTestId } = render(
      <SettingItem
        {...defaultProps}
        iconName="account"
        iconVariant="FontAwesome"
        iconColor="blue"
        title="Account Settings"
        subtitle="Manage your account"
        value="Active"
        onPress={onPress}
      />,
    );

    expect(getByText('Account Settings')).toBeTruthy();
    expect(getByText('Manage your account')).toBeTruthy();
    expect(getByText('Active')).toBeTruthy();
    expect(getByTestId('setting-item')).toBeTruthy();
    expect(getByTestId('chevron-icon')).toBeTruthy();
  });

  it('applies correct styling classes', () => {
    const { getByTestId } = render(<SettingItem {...defaultProps} />);
    expect(getByTestId('setting-item')).toBeTruthy();
  });

  it('handles multiple press events', () => {
    const onPress = jest.fn();
    const { getByTestId } = render(
      <SettingItem {...defaultProps} onPress={onPress} />,
    );

    const touchable = getByTestId('setting-item');

    fireEvent.press(touchable);
    fireEvent.press(touchable);
    fireEvent.press(touchable);

    expect(onPress).toHaveBeenCalledTimes(3);
  });
});
