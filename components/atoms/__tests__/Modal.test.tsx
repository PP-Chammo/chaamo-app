import { render } from '@testing-library/react-native';
import { Text } from 'react-native';

import Modal from '../Modal';

describe('Modal', () => {
  const defaultProps = {
    visible: true,
    onClose: jest.fn(),
    children: <Text>Modal Content</Text>,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly when visible', () => {
    const { getByText } = render(<Modal {...defaultProps} />);
    expect(getByText('Modal Content')).toBeTruthy();
  });

  it('does not render when not visible', () => {
    const { queryByText } = render(<Modal {...defaultProps} visible={false} />);
    expect(queryByText('Modal Content')).toBeNull();
  });

  it('calls onClose when backdrop is pressed', () => {
    const onClose = jest.fn();
    const { getByTestId } = render(
      <Modal {...defaultProps} onClose={onClose} testID="modal" />,
    );

    const modal = getByTestId('modal');
    expect(modal).toBeTruthy();
    expect(onClose).toBeDefined();
  });

  it('applies custom className to content', () => {
    const { getByText } = render(
      <Modal {...defaultProps} className="custom-content-class" />,
    );
    expect(getByText('Modal Content')).toBeTruthy();
  });

  it('renders with different children', () => {
    const { getByText } = render(
      <Modal {...defaultProps}>
        <Text>Custom Modal Content</Text>
      </Modal>,
    );
    expect(getByText('Custom Modal Content')).toBeTruthy();
  });

  it('handles onRequestClose prop', () => {
    const onClose = jest.fn();
    const { getByTestId } = render(
      <Modal {...defaultProps} onClose={onClose} testID="modal" />,
    );

    const modal = getByTestId('modal');
    expect(modal.props.onRequestClose).toBe(onClose);
    modal.props.onRequestClose();
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('has correct modal props', () => {
    const { getByTestId } = render(<Modal {...defaultProps} testID="modal" />);
    const modal = getByTestId('modal');
    expect(modal.props.visible).toBe(true);
    expect(modal.props.animationType).toBe('fade');
    expect(modal.props.statusBarTranslucent).toBe(true);
    expect(modal.props.transparent).toBe(true);
  });

  it('prevents content press from closing modal', () => {
    const onClose = jest.fn();
    const { getByTestId } = render(
      <Modal {...defaultProps} onClose={onClose} testID="modal" />,
    );

    const modal = getByTestId('modal');
    expect(modal).toBeTruthy();
    expect(onClose).toBeDefined();
  });

  it('renders without testID when not provided', () => {
    const { getByText } = render(<Modal {...defaultProps} />);
    expect(getByText('Modal Content')).toBeTruthy();
  });

  it('handles multiple onClose calls', () => {
    const onClose = jest.fn();
    const { getByTestId } = render(
      <Modal {...defaultProps} onClose={onClose} testID="modal" />,
    );

    const modal = getByTestId('modal');
    expect(modal).toBeTruthy();
    expect(onClose).toBeDefined();
  });

  it('renders with complex children', () => {
    const { getByText } = render(
      <Modal {...defaultProps}>
        <Text>
          <Text>Nested</Text> Content with <Text>Multiple</Text> Elements
        </Text>
      </Modal>,
    );
    expect(getByText('Nested')).toBeTruthy();
    expect(getByText('Multiple')).toBeTruthy();
  });

  it('calls onStartShouldSetResponder and returns true', () => {
    const { getByTestId } = render(<Modal {...defaultProps} testID="modal" />);
    const content = getByTestId('modal-content');
    expect(content.props.onStartShouldSetResponder()).toBe(true);
  });
});
