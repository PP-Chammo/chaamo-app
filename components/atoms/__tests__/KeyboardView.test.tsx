import React from 'react';

import { render } from '@testing-library/react-native';
import { Text, View } from 'react-native';

import KeyboardView from '../KeyboardView';

jest.mock('react-native-keyboard-aware-scroll-view', () => ({
  KeyboardAwareScrollView: 'KeyboardAwareScrollView',
}));

describe('KeyboardView', () => {
  const defaultProps = {
    children: (
      <View testID="test-child">
        <Text>Test Child</Text>
      </View>
    ),
  };

  it('renders correctly with default props', () => {
    const { getByTestId } = render(<KeyboardView {...defaultProps} />);
    expect(getByTestId('test-child')).toBeTruthy();
  });

  it('renders with custom className', () => {
    const { getByTestId } = render(
      <KeyboardView {...defaultProps} className="custom-class" />,
    );
    expect(getByTestId('test-child')).toBeTruthy();
  });

  it('renders with custom contentContainerClassName', () => {
    const { getByTestId } = render(
      <KeyboardView
        {...defaultProps}
        contentContainerClassName="custom-content-class"
      />,
    );
    expect(getByTestId('test-child')).toBeTruthy();
  });

  it('renders with multiple children', () => {
    const { getByTestId } = render(
      <KeyboardView>
        <View testID="child-1">
          <Text>Child 1</Text>
        </View>
        <View testID="child-2">
          <Text>Child 2</Text>
        </View>
      </KeyboardView>,
    );
    expect(getByTestId('child-1')).toBeTruthy();
    expect(getByTestId('child-2')).toBeTruthy();
  });
});
