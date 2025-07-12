import { render } from '@testing-library/react-native';

import Row from '../Row';

describe('Row', () => {
  const defaultProps = {
    children: <div>Test Content</div>,
  };

  it('renders correctly with default props', () => {
    const { toJSON } = render(<Row {...defaultProps} />);
    expect(toJSON()).toBeTruthy();
  });

  it('renders with center alignment', () => {
    const { toJSON } = render(<Row {...defaultProps} center />);
    expect(toJSON()).toBeTruthy();
  });

  it('renders with right alignment', () => {
    const { toJSON } = render(<Row {...defaultProps} right />);
    expect(toJSON()).toBeTruthy();
  });

  it('renders with between alignment', () => {
    const { toJSON } = render(<Row {...defaultProps} between />);
    expect(toJSON()).toBeTruthy();
  });

  it('applies custom className', () => {
    const { toJSON } = render(
      <Row {...defaultProps} className="custom-row-class" />,
    );
    expect(toJSON()).toBeTruthy();
  });

  it('renders with multiple children', () => {
    const { toJSON } = render(
      <Row>
        <div>Child 1</div>
        <div>Child 2</div>
        <div>Child 3</div>
      </Row>,
    );
    expect(toJSON()).toBeTruthy();
  });

  it('renders with different alignment combinations', () => {
    const alignments = [
      { center: true },
      { right: true },
      { between: true },
      { center: true, right: true },
    ];

    alignments.forEach((alignment) => {
      const { toJSON } = render(<Row {...defaultProps} {...alignment} />);
      expect(toJSON()).toBeTruthy();
    });
  });

  it('passes through ViewProps', () => {
    const { toJSON } = render(
      <Row {...defaultProps} testID="row-test" accessibilityLabel="Test Row" />,
    );
    expect(toJSON()).toBeTruthy();
  });
});
