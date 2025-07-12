import { render } from '@testing-library/react-native';

import ScreenContainer from '../ScreenContainer';

describe('ScreenContainer', () => {
  const defaultProps = {
    children: <div>Test Content</div>,
  };

  it('renders correctly with default props', () => {
    const { toJSON } = render(<ScreenContainer {...defaultProps} />);
    expect(toJSON()).toBeTruthy();
  });

  it('renders with custom classNameTop', () => {
    const { toJSON } = render(
      <ScreenContainer {...defaultProps} classNameTop="custom-top-class" />,
    );
    expect(toJSON()).toBeTruthy();
  });

  it('renders with custom classNameBottom', () => {
    const { toJSON } = render(
      <ScreenContainer
        {...defaultProps}
        classNameBottom="custom-bottom-class"
      />,
    );
    expect(toJSON()).toBeTruthy();
  });

  it('renders with background className', () => {
    const { toJSON } = render(
      <ScreenContainer {...defaultProps} className="bg-blue-500" />,
    );
    expect(toJSON()).toBeTruthy();
  });

  it('renders with non-background className', () => {
    const { toJSON } = render(
      <ScreenContainer {...defaultProps} className="p-4" />,
    );
    expect(toJSON()).toBeTruthy();
  });

  it('renders with multiple children', () => {
    const { toJSON } = render(
      <ScreenContainer>
        <div>Child 1</div>
        <div>Child 2</div>
        <div>Child 3</div>
      </ScreenContainer>,
    );
    expect(toJSON()).toBeTruthy();
  });

  it('renders with custom style', () => {
    const customStyle = { backgroundColor: 'red' };
    const { toJSON } = render(
      <ScreenContainer {...defaultProps} style={customStyle} />,
    );
    expect(toJSON()).toBeTruthy();
  });

  it('passes through ViewProps', () => {
    const { toJSON } = render(
      <ScreenContainer
        {...defaultProps}
        testID="screen-container-test"
        accessibilityLabel="Test Screen Container"
      />,
    );
    expect(toJSON()).toBeTruthy();
  });

  it('renders with all custom props', () => {
    const { toJSON } = render(
      <ScreenContainer
        {...defaultProps}
        className="bg-white p-4"
        classNameTop="custom-top"
        classNameBottom="custom-bottom"
        style={{ padding: 20 }}
      />,
    );
    expect(toJSON()).toBeTruthy();
  });
});
