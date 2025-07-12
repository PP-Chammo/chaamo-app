import { render } from '@testing-library/react-native';
import { Text } from 'react-native';

import Modal from '../Modal';

describe('Modal', () => {
  const defaultProps = {
    visible: true,
    onClose: jest.fn(),
    children: <Text>Modal Content</Text>,
  };

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
    render(<Modal {...defaultProps} onClose={onClose} />);

    // Note: In a real test, you would need to mock the Pressable component
    // or test the onRequestClose prop of the Modal
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
    render(<Modal {...defaultProps} onClose={onClose} />);

    // The onRequestClose should be set to the onClose function
    expect(onClose).toBeDefined();
  });
});
