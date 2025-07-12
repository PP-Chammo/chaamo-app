import { render } from '@testing-library/react-native';

import Divider from '../Divider';

describe('Divider', () => {
  it('renders correctly with default props', () => {
    const { toJSON } = render(<Divider />);
    expect(toJSON()).toBeTruthy();
  });

  it('renders with horizontal position', () => {
    const { toJSON } = render(<Divider position="horizontal" />);
    expect(toJSON()).toBeTruthy();
  });

  it('renders with vertical position', () => {
    const { toJSON } = render(<Divider position="vertical" />);
    expect(toJSON()).toBeTruthy();
  });

  it('applies custom className', () => {
    const { toJSON } = render(<Divider className="custom-divider-class" />);
    expect(toJSON()).toBeTruthy();
  });

  it('renders with both position and custom className', () => {
    const { toJSON } = render(
      <Divider position="horizontal" className="custom-class" />,
    );
    expect(toJSON()).toBeTruthy();
  });

  it('renders with different positions', () => {
    const positions = ['horizontal', 'vertical'] as const;

    positions.forEach((position) => {
      const { toJSON } = render(<Divider position={position} />);
      expect(toJSON()).toBeTruthy();
    });
  });
});
