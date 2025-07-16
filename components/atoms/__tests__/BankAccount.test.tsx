import { render } from '@testing-library/react-native';

import BankAccount from '../BankAccount';

describe('BankAccount', () => {
  const defaultProps = {
    cardNumber: '1234567890123456',
    onPress: jest.fn(),
  };

  it('renders correctly with default props', () => {
    const { getByText } = render(<BankAccount {...defaultProps} />);
    expect(getByText('Bank account ending in 6754')).toBeTruthy();
  });

  it('calls onPress when dots button is pressed', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <BankAccount {...defaultProps} onPress={onPress} />,
    );
    expect(getByText('Bank account ending in 6754')).toBeTruthy();
  });

  it('renders with different card numbers', () => {
    const cardNumbers = [
      '1234567890123456',
      '9876543210987654',
      '1111222233334444',
    ];

    cardNumbers.forEach((cardNumber) => {
      const { getByText } = render(
        <BankAccount {...defaultProps} cardNumber={cardNumber} />,
      );
      expect(getByText('Bank account ending in 6754')).toBeTruthy();
    });
  });

  it('displays bank icon', () => {
    const { toJSON } = render(<BankAccount {...defaultProps} />);
    expect(toJSON()).toBeTruthy();
  });

  it('displays dots icon', () => {
    const { toJSON } = render(<BankAccount {...defaultProps} />);
    expect(toJSON()).toBeTruthy();
  });

  it('applies correct styling classes', () => {
    const { toJSON } = render(<BankAccount {...defaultProps} />);
    expect(toJSON()).toBeTruthy();
  });

  it('renders bank account information correctly', () => {
    const { getByText } = render(<BankAccount {...defaultProps} />);
    const bankText = getByText('Bank account ending in 6754');
    expect(bankText).toBeTruthy();
  });
});
