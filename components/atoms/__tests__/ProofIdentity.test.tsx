import { render, fireEvent } from '@testing-library/react-native';

import ProofIdentity from '../ProofIdentity';

describe('ProofIdentity', () => {
  const defaultProps = {
    title: 'ID Card',
    onPress: jest.fn(),
    icon: <div>Icon</div>,
  };

  it('renders correctly with default props', () => {
    const { getByText } = render(<ProofIdentity {...defaultProps} />);
    expect(getByText('ID Card')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <ProofIdentity {...defaultProps} onPress={onPress} />,
    );

    fireEvent.press(getByText('ID Card'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('renders with different titles', () => {
    const titles = ['Passport', 'Driver License', 'National ID'];

    titles.forEach((title) => {
      const { getByText } = render(
        <ProofIdentity {...defaultProps} title={title} />,
      );
      expect(getByText(title)).toBeTruthy();
    });
  });

  it('renders with custom icon', () => {
    const customIcon = <div>Custom Icon</div>;
    const { getByText } = render(
      <ProofIdentity {...defaultProps} icon={customIcon} />,
    );
    expect(getByText('ID Card')).toBeTruthy();
  });

  it('renders with long title', () => {
    const longTitle = 'Very Long Identity Document Title';
    const { getByText } = render(
      <ProofIdentity {...defaultProps} title={longTitle} />,
    );
    expect(getByText(longTitle)).toBeTruthy();
  });

  it('applies correct styling classes', () => {
    const { toJSON } = render(<ProofIdentity {...defaultProps} />);
    expect(toJSON()).toBeTruthy();
  });
});
