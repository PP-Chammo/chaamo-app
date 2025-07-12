import { render, fireEvent } from '@testing-library/react-native';

import ProfileStat from '../ProfileStat';

describe('ProfileStat', () => {
  const defaultProps = {
    title: 'Followers',
    value: '1.2K',
  };

  it('renders correctly with default props', () => {
    const { getByText } = render(<ProfileStat {...defaultProps} />);
    expect(getByText('Followers')).toBeTruthy();
    expect(getByText('1.2K')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <ProfileStat {...defaultProps} onPress={onPress} />,
    );

    fireEvent.press(getByText('Followers'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('does not call onPress when onPress is not provided', () => {
    const { getByText } = render(<ProfileStat {...defaultProps} />);

    expect(() => {
      fireEvent.press(getByText('Followers'));
    }).not.toThrow();
  });

  it('applies custom className', () => {
    const { getByText } = render(
      <ProfileStat {...defaultProps} className="custom-stat-class" />,
    );
    expect(getByText('Followers')).toBeTruthy();
    expect(getByText('1.2K')).toBeTruthy();
  });

  it('renders with different titles and values', () => {
    const testCases = [
      { title: 'Posts', value: '42' },
      { title: 'Following', value: '156' },
      { title: 'Likes', value: '2.5K' },
    ];

    testCases.forEach(({ title, value }) => {
      const { getByText } = render(<ProfileStat title={title} value={value} />);
      expect(getByText(title)).toBeTruthy();
      expect(getByText(value)).toBeTruthy();
    });
  });

  it('renders with long title and value', () => {
    const longTitle = 'Very Long Profile Statistic Title';
    const longValue = '1,234,567';

    const { getByText } = render(
      <ProfileStat title={longTitle} value={longValue} />,
    );
    expect(getByText(longTitle)).toBeTruthy();
    expect(getByText(longValue)).toBeTruthy();
  });
});
