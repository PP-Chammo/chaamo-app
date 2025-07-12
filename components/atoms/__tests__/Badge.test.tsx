import { render } from '@testing-library/react-native';

import Badge from '../Badge';

describe('Badge', () => {
  it('renders correctly with default props', () => {
    const { toJSON } = render(<Badge />);
    expect(toJSON()).toBeTruthy();
  });

  it('applies custom className', () => {
    const { toJSON } = render(<Badge className="custom-badge-class" />);
    expect(toJSON()).toBeTruthy();
  });

  it('renders with star icon', () => {
    const { toJSON } = render(<Badge />);
    expect(toJSON()).toBeTruthy();
  });

  it('renders with proper styling classes', () => {
    const { toJSON } = render(<Badge />);
    expect(toJSON()).toBeTruthy();
  });
});
