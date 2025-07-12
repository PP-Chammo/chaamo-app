import { render } from '@testing-library/react-native';

import Label from '../Label';

describe('Label', () => {
  const defaultProps = {
    children: 'Test Label',
  };

  it('renders correctly with default props', () => {
    const { getByText } = render(<Label {...defaultProps} />);
    expect(getByText('Test Label')).toBeTruthy();
  });

  it('renders with different variants', () => {
    const variants = ['title', 'subtitle'] as const;

    variants.forEach((variant) => {
      const { getByText } = render(
        <Label {...defaultProps} variant={variant} />,
      );
      expect(getByText('Test Label')).toBeTruthy();
    });
  });

  it('applies custom className', () => {
    const { getByText } = render(
      <Label {...defaultProps} className="custom-label-class" />,
    );
    expect(getByText('Test Label')).toBeTruthy();
  });

  it('renders with different text content', () => {
    const texts = ['Label 1', 'Label 2', 'Label 3'];

    texts.forEach((text) => {
      const { getByText } = render(<Label>{text}</Label>);
      expect(getByText(text)).toBeTruthy();
    });
  });
});
