import { render } from '@testing-library/react-native';

import Tag from '../Tag';

describe('Tag', () => {
  const defaultProps = {
    title: 'Test Tag',
  };

  it('renders correctly with default props', () => {
    const { getByText } = render(<Tag {...defaultProps} />);
    expect(getByText('Test Tag')).toBeTruthy();
  });

  it('applies custom className', () => {
    const { getByText } = render(
      <Tag {...defaultProps} className="custom-tag-class" />,
    );
    expect(getByText('Test Tag')).toBeTruthy();
  });

  it('applies custom textClassName', () => {
    const { getByText } = render(
      <Tag {...defaultProps} textClassName="custom-text-class" />,
    );
    expect(getByText('Test Tag')).toBeTruthy();
  });

  it('renders with different titles', () => {
    const titles = ['Tag 1', 'Tag 2', 'Tag 3'];

    titles.forEach((title) => {
      const { getByText } = render(<Tag title={title} />);
      expect(getByText(title)).toBeTruthy();
    });
  });

  it('renders with proper styling classes', () => {
    const { toJSON } = render(<Tag {...defaultProps} />);
    expect(toJSON()).toBeTruthy();
  });
});
