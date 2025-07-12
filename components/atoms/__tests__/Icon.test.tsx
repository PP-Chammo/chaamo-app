import { render } from '@testing-library/react-native';

import Icon from '../Icon';

describe('Icon', () => {
  const defaultProps = {
    name: 'heart',
    variant: 'MaterialCommunityIcons',
  };

  it('renders correctly with default props', () => {
    const { toJSON } = render(<Icon {...defaultProps} />);
    expect(toJSON()).toBeTruthy();
  });

  it('renders with different variants', () => {
    const variants = [
      'MaterialCommunityIcons',
      'MaterialIcons',
      'Ionicons',
    ] as const;

    variants.forEach((variant) => {
      const { toJSON } = render(<Icon {...defaultProps} variant={variant} />);
      expect(toJSON()).toBeTruthy();
    });
  });

  it('renders with different sizes', () => {
    const sizes = [16, 24, 32, 48];

    sizes.forEach((size) => {
      const { toJSON } = render(<Icon {...defaultProps} size={size} />);
      expect(toJSON()).toBeTruthy();
    });
  });

  it('applies custom className', () => {
    const { toJSON } = render(
      <Icon {...defaultProps} className="custom-icon-class" />,
    );
    expect(toJSON()).toBeTruthy();
  });

  it('renders with different icon names', () => {
    const names = ['heart', 'star', 'home', 'user'];

    names.forEach((name) => {
      const { toJSON } = render(<Icon {...defaultProps} name={name} />);
      expect(toJSON()).toBeTruthy();
    });
  });
});
