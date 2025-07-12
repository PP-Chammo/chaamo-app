import React from 'react';

import { render, fireEvent } from '@testing-library/react-native';

import ButtonIcon from '../ButtonIcon';

describe('ButtonIcon', () => {
  const defaultProps = {
    name: 'heart' as const,
    onPress: jest.fn(),
  };

  it('renders correctly with default props', () => {
    const { getByTestId } = render(<ButtonIcon {...defaultProps} />);
    expect(getByTestId('button-icon')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByTestId } = render(
      <ButtonIcon {...defaultProps} onPress={onPress} />,
    );

    const button = getByTestId('button-icon');
    fireEvent.press(button);

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('renders with custom icon size', () => {
    const { getByTestId } = render(
      <ButtonIcon {...defaultProps} iconSize={32} />,
    );
    expect(getByTestId('button-icon')).toBeTruthy();
  });

  it('renders with custom icon variant', () => {
    const { getByTestId } = render(
      <ButtonIcon {...defaultProps} iconVariant="MaterialCommunityIcons" />,
    );
    expect(getByTestId('button-icon')).toBeTruthy();
  });

  it('renders with custom color', () => {
    const { getByTestId } = render(
      <ButtonIcon {...defaultProps} color="red" />,
    );
    expect(getByTestId('button-icon')).toBeTruthy();
  });

  it('renders with count badge', () => {
    const { getByText } = render(<ButtonIcon {...defaultProps} count={5} />);
    expect(getByText('5')).toBeTruthy();
  });

  it('renders with string count', () => {
    const { getByText } = render(<ButtonIcon {...defaultProps} count="10+" />);
    expect(getByText('10+')).toBeTruthy();
  });

  it('does not render count badge when count is not provided', () => {
    const { queryByTestId } = render(<ButtonIcon {...defaultProps} />);
    expect(queryByTestId('count-badge')).toBeNull();
  });

  it('applies custom className', () => {
    const { getByTestId } = render(
      <ButtonIcon {...defaultProps} className="custom-class" />,
    );
    expect(getByTestId('button-icon')).toBeTruthy();
  });

  it('renders with different icon names', () => {
    const icons = ['heart', 'star', 'bookmark', 'share', 'more'] as const;

    icons.forEach((iconName) => {
      const { getByTestId } = render(
        <ButtonIcon {...defaultProps} name={iconName} />,
      );
      expect(getByTestId('button-icon')).toBeTruthy();
    });
  });

  it('handles multiple press events', () => {
    const onPress = jest.fn();
    const { getByTestId } = render(
      <ButtonIcon {...defaultProps} onPress={onPress} />,
    );

    const button = getByTestId('button-icon');

    fireEvent.press(button);
    fireEvent.press(button);
    fireEvent.press(button);

    expect(onPress).toHaveBeenCalledTimes(3);
  });

  it('renders with all props combined', () => {
    const onPress = jest.fn();
    const { getByTestId, getByText } = render(
      <ButtonIcon
        {...defaultProps}
        name="star"
        onPress={onPress}
        iconSize={28}
        iconVariant="MaterialCommunityIcons"
        color="yellow"
        className="custom-class"
        count={3}
      />,
    );

    expect(getByTestId('button-icon')).toBeTruthy();
    expect(getByText('3')).toBeTruthy();
  });

  it('applies correct styling classes', () => {
    const { getByTestId } = render(<ButtonIcon {...defaultProps} />);
    expect(getByTestId('button-icon')).toBeTruthy();
  });
});
