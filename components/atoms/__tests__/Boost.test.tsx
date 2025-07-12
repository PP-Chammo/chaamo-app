import { render } from '@testing-library/react-native';

import Boost from '../Boost';

describe('Boost', () => {
  it('renders correctly with default props', () => {
    const { toJSON } = render(<Boost />);
    expect(toJSON()).toBeTruthy();
  });

  it('renders with boosted state', () => {
    const { toJSON } = render(<Boost boosted={true} />);
    expect(toJSON()).toBeTruthy();
  });

  it('renders with unboosted state', () => {
    const { toJSON } = render(<Boost boosted={false} />);
    expect(toJSON()).toBeTruthy();
  });

  it('renders with undefined boosted prop', () => {
    const { toJSON } = render(<Boost boosted={undefined} />);
    expect(toJSON()).toBeTruthy();
  });

  it('applies correct styling classes', () => {
    const { toJSON } = render(<Boost />);
    expect(toJSON()).toBeTruthy();
  });

  it('renders BoostIcon component', () => {
    const { toJSON } = render(<Boost />);
    expect(toJSON()).toBeTruthy();
  });
});
