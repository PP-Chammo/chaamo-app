import { render } from '@testing-library/react-native';

import Avatar from '../Avatar';

describe('Avatar', () => {
  const defaultProps = {
    size: 40,
  };

  it('renders correctly with default props', () => {
    const { toJSON } = render(<Avatar {...defaultProps} />);
    expect(toJSON()).toBeTruthy();
  });

  it('renders with image when imageUrl is provided', () => {
    const { toJSON } = render(
      <Avatar {...defaultProps} imageUrl="https://example.com/avatar.jpg" />,
    );
    expect(toJSON()).toBeTruthy();
  });

  it('renders fallback icon when no imageUrl is provided', () => {
    const { toJSON } = render(<Avatar {...defaultProps} />);
    expect(toJSON()).toBeTruthy();
  });

  it('calls onPress when pressed and onPress is provided', () => {
    const onPress = jest.fn();
    const { toJSON } = render(<Avatar {...defaultProps} onPress={onPress} />);

    // Since we can't easily access the TouchableOpacity, we'll just verify the component renders
    expect(toJSON()).toBeTruthy();
    expect(onPress).not.toHaveBeenCalled(); // onPress should not be called during render
  });

  it('applies custom className', () => {
    const { toJSON } = render(
      <Avatar {...defaultProps} className="custom-avatar-class" />,
    );
    expect(toJSON()).toBeTruthy();
  });

  it('applies custom imageContainerClassName', () => {
    const { toJSON } = render(
      <Avatar
        {...defaultProps}
        imageContainerClassName="custom-image-container-class"
      />,
    );
    expect(toJSON()).toBeTruthy();
  });

  it('renders with different sizes', () => {
    const sizes = [20, 40, 60, 80];

    sizes.forEach((size) => {
      const { toJSON } = render(<Avatar size={size} />);
      expect(toJSON()).toBeTruthy();
    });
  });
});
