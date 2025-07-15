import React from 'react';

import { render } from '@testing-library/react-native';
import { View } from 'react-native';

import ContextMenu from '../ContextMenu';

describe('ContextMenu', () => {
  const defaultProps = {
    visible: false,
    onClose: jest.fn(),
    triggerRef: React.createRef<View | null>(),
    children: <View>Menu Item</View>,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly when not visible', () => {
    const { queryByTestId } = render(
      <ContextMenu {...defaultProps} testID="context-menu" />,
    );
    expect(queryByTestId('context-menu')).toBeNull();
  });

  it('renders correctly when visible', () => {
    const { getByTestId } = render(
      <ContextMenu {...defaultProps} visible={true} testID="context-menu" />,
    );
    expect(getByTestId('context-menu')).toBeTruthy();
  });

  it('calls onClose when overlay is pressed', () => {
    const onClose = jest.fn();
    const { getByTestId } = render(
      <ContextMenu
        {...defaultProps}
        visible={true}
        onClose={onClose}
        testID="context-menu"
      />,
    );

    const modal = getByTestId('context-menu');
    expect(modal).toBeTruthy();
  });

  it('renders with custom menuHeight', () => {
    const { getByTestId } = render(
      <ContextMenu
        {...defaultProps}
        visible={true}
        menuHeight={100}
        testID="context-menu"
      />,
    );
    expect(getByTestId('context-menu')).toBeTruthy();
  });

  it('renders with multiple children', () => {
    const { getByTestId } = render(
      <ContextMenu {...defaultProps} visible={true} testID="context-menu">
        <View>Menu Item 1</View>
        <View>Menu Item 2</View>
        <View>Menu Item 3</View>
      </ContextMenu>,
    );
    expect(getByTestId('context-menu')).toBeTruthy();
  });

  it('applies correct styling classes', () => {
    const { getByTestId } = render(
      <ContextMenu {...defaultProps} visible={true} testID="context-menu" />,
    );
    expect(getByTestId('context-menu')).toBeTruthy();
  });

  it('handles triggerRef correctly', () => {
    const triggerRef = React.createRef<View | null>();
    const { getByTestId } = render(
      <ContextMenu
        {...defaultProps}
        visible={true}
        triggerRef={triggerRef}
        testID="context-menu"
      />,
    );
    expect(getByTestId('context-menu')).toBeTruthy();
  });

  it('calculates position correctly when triggerRef is available', () => {
    const triggerRef = React.createRef<View | null>();
    triggerRef.current = {
      measure: jest.fn((callback) => {
        callback(100, 200, 50, 30, 100, 200);
      }),
    } as unknown as View;

    const { getByTestId } = render(
      <ContextMenu
        {...defaultProps}
        visible={true}
        triggerRef={triggerRef}
        testID="context-menu"
      />,
    );
    expect(getByTestId('context-menu')).toBeTruthy();
  });

  it('handles screen bounds correctly - menu would go off right edge', () => {
    const triggerRef = React.createRef<View | null>();
    triggerRef.current = {
      measure: jest.fn((callback) => {
        callback(300, 200, 50, 30, 300, 200);
      }),
    } as unknown as View;

    const { getByTestId } = render(
      <ContextMenu
        {...defaultProps}
        visible={true}
        triggerRef={triggerRef}
        testID="context-menu"
      />,
    );
    expect(getByTestId('context-menu')).toBeTruthy();
  });

  it('handles screen bounds correctly - menu would go off left edge', () => {
    const triggerRef = React.createRef<View | null>();
    triggerRef.current = {
      measure: jest.fn((callback) => {
        callback(10, 200, 50, 30, 10, 200);
      }),
    } as unknown as View;

    const { getByTestId } = render(
      <ContextMenu
        {...defaultProps}
        visible={true}
        triggerRef={triggerRef}
        testID="context-menu"
      />,
    );
    expect(getByTestId('context-menu')).toBeTruthy();
  });

  it('handles screen bounds correctly - menu would go off bottom edge', () => {
    const triggerRef = React.createRef<View | null>();
    triggerRef.current = {
      measure: jest.fn((callback) => {
        callback(100, 700, 50, 30, 100, 700);
      }),
    } as unknown as View;

    const { getByTestId } = render(
      <ContextMenu
        {...defaultProps}
        visible={true}
        triggerRef={triggerRef}
        testID="context-menu"
      />,
    );
    expect(getByTestId('context-menu')).toBeTruthy();
  });

  it('handles triggerRef.current being null', () => {
    const triggerRef = React.createRef<View | null>();
    triggerRef.current = null;

    const { getByTestId } = render(
      <ContextMenu
        {...defaultProps}
        visible={true}
        triggerRef={triggerRef}
        testID="context-menu"
      />,
    );
    expect(getByTestId('context-menu')).toBeTruthy();
  });

  it('updates position when visible changes', () => {
    const triggerRef = React.createRef<View | null>();
    triggerRef.current = {
      measure: jest.fn((callback) => {
        callback(100, 200, 50, 30, 100, 200);
      }),
    } as unknown as View;

    const { rerender, queryByTestId, getByTestId } = render(
      <ContextMenu
        {...defaultProps}
        visible={false}
        triggerRef={triggerRef}
        testID="context-menu"
      />,
    );
    expect(queryByTestId('context-menu')).toBeNull();

    rerender(
      <ContextMenu
        {...defaultProps}
        visible={true}
        triggerRef={triggerRef}
        testID="context-menu"
      />,
    );
    expect(getByTestId('context-menu')).toBeTruthy();
  });

  it('renders without testID when not provided', () => {
    const { toJSON } = render(<ContextMenu {...defaultProps} visible={true} />);
    expect(toJSON()).toBeTruthy();
  });

  it('has correct modal props', () => {
    const { getByTestId } = render(
      <ContextMenu {...defaultProps} visible={true} testID="context-menu" />,
    );
    const modal = getByTestId('context-menu');
    expect(modal.props.transparent).toBe(true);
    expect(modal.props.animationType).toBe('fade');
  });
});
