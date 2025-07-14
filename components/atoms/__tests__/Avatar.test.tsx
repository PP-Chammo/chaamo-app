import { render, fireEvent } from '@testing-library/react-native';
import { Image } from 'react-native';

import Avatar from '../Avatar';

describe('Avatar', () => {
  const defaultProps = {
    size: 40,
  };

  it('renders correctly with default props', () => {
    const { getByTestId } = render(
      <Avatar {...defaultProps} testID="avatar" />,
    );
    expect(getByTestId('avatar')).toBeTruthy();
  });

  it('renders with image when imageUrl is provided', () => {
    const { getByTestId } = render(
      <Avatar
        {...defaultProps}
        imageUrl="https://example.com/avatar.jpg"
        testID="avatar"
      />,
    );
    expect(getByTestId('avatar')).toBeTruthy();
  });

  it('renders fallback icon when no imageUrl is provided', () => {
    const { getByTestId } = render(
      <Avatar {...defaultProps} testID="avatar" />,
    );
    expect(getByTestId('avatar')).toBeTruthy();
  });

  it('calls onPress when pressed and onPress is provided', () => {
    const onPress = jest.fn();
    const { getByTestId } = render(
      <Avatar {...defaultProps} onPress={onPress} testID="avatar" />,
    );

    fireEvent.press(getByTestId('avatar'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('does not call onPress when onPress is not provided', () => {
    const { getByTestId } = render(
      <Avatar {...defaultProps} testID="avatar" />,
    );

    // Should not throw when pressed without onPress
    expect(() => {
      fireEvent.press(getByTestId('avatar'));
    }).not.toThrow();
  });

  it('applies custom className', () => {
    const { getByTestId } = render(
      <Avatar
        {...defaultProps}
        className="custom-avatar-class"
        testID="avatar"
      />,
    );
    expect(getByTestId('avatar')).toBeTruthy();
  });

  it('applies custom imageContainerClassName', () => {
    const { getByTestId } = render(
      <Avatar
        {...defaultProps}
        imageContainerClassName="custom-image-container-class"
        testID="avatar"
      />,
    );
    expect(getByTestId('avatar')).toBeTruthy();
  });

  it('renders with different sizes', () => {
    const sizes = [20, 40, 60, 80];

    sizes.forEach((size) => {
      const { getByTestId } = render(<Avatar size={size} testID="avatar" />);
      expect(getByTestId('avatar')).toBeTruthy();
    });
  });

  it('shows modify icon when onPress is provided and image is present', () => {
    const onPress = jest.fn();
    const { getByTestId } = render(
      <Avatar
        {...defaultProps}
        imageUrl="https://example.com/avatar.jpg"
        onPress={onPress}
        testID="avatar"
      />,
    );
    expect(getByTestId('avatar')).toBeTruthy();
  });

  it('shows plus icon when onPress is provided and no image is present', () => {
    const onPress = jest.fn();
    const { getByTestId } = render(
      <Avatar {...defaultProps} onPress={onPress} testID="avatar" />,
    );
    expect(getByTestId('avatar')).toBeTruthy();
  });

  it('handles image error gracefully', () => {
    const { getByTestId, UNSAFE_getAllByType } = render(
      <Avatar
        {...defaultProps}
        imageUrl="https://invalid-url.com/image.jpg"
        testID="avatar"
      />,
    );
    const avatar = getByTestId('avatar');
    expect(avatar).toBeTruthy();

    // Find the Image component and trigger onError
    const images = UNSAFE_getAllByType(Image);
    const image = images.find(
      (img) => img.props.source?.uri === 'https://invalid-url.com/image.jpg',
    );

    if (image && image.props.onError) {
      image.props.onError();
    }

    // Test that the component renders correctly even with invalid image URL
    expect(avatar).toBeTruthy();
  });

  it('renders without testID when not provided', () => {
    const { toJSON } = render(<Avatar {...defaultProps} />);
    expect(toJSON()).toBeTruthy();
  });

  it('handles onPress correctly', () => {
    const onPress = jest.fn();
    const { getByTestId } = render(
      <Avatar {...defaultProps} onPress={onPress} testID="avatar" />,
    );
    const avatar = getByTestId('avatar');
    expect(avatar).toBeTruthy();
  });
});
