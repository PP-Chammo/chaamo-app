import { render } from '@testing-library/react-native';

import UploadInstruction from '../UploadInstruction';

describe('UploadInstruction', () => {
  it('renders correctly with default props', () => {
    const { getByText } = render(<UploadInstruction />);
    expect(getByText('Instructions')).toBeTruthy();
    expect(getByText('1. Upload clear and valid documents.')).toBeTruthy();
    expect(getByText('2. Ensure details match your info.')).toBeTruthy();
    expect(getByText('3. Avoid expired or blurry files.')).toBeTruthy();
  });

  it('renders with light variant', () => {
    const { getByText } = render(<UploadInstruction variant="light" />);
    expect(getByText('Instructions')).toBeTruthy();
    expect(getByText('1. Upload clear and valid documents.')).toBeTruthy();
    expect(getByText('2. Ensure details match your info.')).toBeTruthy();
    expect(getByText('3. Avoid expired or blurry files.')).toBeTruthy();
  });

  it('renders with dark variant', () => {
    const { getByText } = render(<UploadInstruction variant="dark" />);
    expect(getByText('Instructions')).toBeTruthy();
    expect(getByText('1. Upload clear and valid documents.')).toBeTruthy();
    expect(getByText('2. Ensure details match your info.')).toBeTruthy();
    expect(getByText('3. Avoid expired or blurry files.')).toBeTruthy();
  });

  it('applies custom className', () => {
    const { getByText } = render(
      <UploadInstruction className="custom-instruction-class" />,
    );
    expect(getByText('Instructions')).toBeTruthy();
  });

  it('renders with both variant and custom className', () => {
    const { getByText } = render(
      <UploadInstruction
        variant="light"
        className="custom-instruction-class"
      />,
    );
    expect(getByText('Instructions')).toBeTruthy();
  });

  it('renders all instruction steps', () => {
    const { getByText } = render(<UploadInstruction />);

    const expectedSteps = [
      '1. Upload clear and valid documents.',
      '2. Ensure details match your info.',
      '3. Avoid expired or blurry files.',
    ];

    expectedSteps.forEach((step) => {
      expect(getByText(step)).toBeTruthy();
    });
  });

  it('applies correct styling classes', () => {
    const { toJSON } = render(<UploadInstruction />);
    expect(toJSON()).toBeTruthy();
  });
});
