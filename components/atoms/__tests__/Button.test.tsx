import { render, fireEvent } from '@testing-library/react-native';

import Button from '../Button';

describe('Button', () => {
  const defaultProps = {
    children: 'Test Button',
  };

  it('renders correctly with default props', () => {
    const { getByText } = render(<Button {...defaultProps} />);
    expect(getByText('Test Button')).toBeTruthy();
  });

  it('renders with different variants', () => {
    const variants = [
      'primary',
      'secondary',
      'danger',
      'light',
      'link',
      'ghost',
      'primary-light',
    ] as const;

    variants.forEach((variant) => {
      const { getByText } = render(
        <Button {...defaultProps} variant={variant} />,
      );
      expect(getByText('Test Button')).toBeTruthy();
    });
  });

  it('renders with different sizes', () => {
    const sizes = ['small', 'medium', 'large'] as const;

    sizes.forEach((size) => {
      const { getByText } = render(<Button {...defaultProps} size={size} />);
      expect(getByText('Test Button')).toBeTruthy();
    });
  });

  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <Button {...defaultProps} onPress={onPress} />,
    );

    fireEvent.press(getByText('Test Button'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('does not call onPress when disabled', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <Button {...defaultProps} onPress={onPress} disabled />,
    );

    fireEvent.press(getByText('Test Button'));
    expect(onPress).not.toHaveBeenCalled();
  });

  it('renders with left icon', () => {
    const { getByText } = render(<Button {...defaultProps} icon="heart" />);
    expect(getByText('Test Button')).toBeTruthy();
  });

  it('renders with right icon', () => {
    const { getByText } = render(
      <Button {...defaultProps} rightIcon="arrow-right" />,
    );
    expect(getByText('Test Button')).toBeTruthy();
  });

  it('renders with both left and right icons', () => {
    const { getByText } = render(
      <Button {...defaultProps} icon="heart" rightIcon="arrow-right" />,
    );
    expect(getByText('Test Button')).toBeTruthy();
  });

  it('applies custom className', () => {
    const { getByText } = render(
      <Button {...defaultProps} className="custom-class" />,
    );
    expect(getByText('Test Button')).toBeTruthy();
  });

  it('applies custom textClassName', () => {
    const { getByText } = render(
      <Button {...defaultProps} textClassName="custom-text-class" />,
    );
    expect(getByText('Test Button')).toBeTruthy();
  });

  it('renders with custom text props', () => {
    const { getByText } = render(
      <Button {...defaultProps} textProps={{ numberOfLines: 2 }} />,
    );
    expect(getByText('Test Button')).toBeTruthy();
  });

  it('renders with custom icon properties', () => {
    const { getByText } = render(
      <Button
        {...defaultProps}
        icon="heart"
        iconSize={24}
        iconColor="red"
        iconVariant="MaterialCommunityIcons"
      />,
    );
    expect(getByText('Test Button')).toBeTruthy();
  });

  it('renders with custom right icon properties', () => {
    const { getByText } = render(
      <Button
        {...defaultProps}
        rightIcon="arrow-right"
        rightIconSize={24}
        rightIconColor="blue"
        rightIconVariant="MaterialCommunityIcons"
      />,
    );
    expect(getByText('Test Button')).toBeTruthy();
  });
});
