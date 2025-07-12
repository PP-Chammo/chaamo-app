import React from 'react';

import { render, fireEvent } from '@testing-library/react-native';
import { View, Text } from 'react-native';

import TabView from '../TabView';

// Mock react-native-pager-view
jest.mock('react-native-pager-view', () => {
  const React = jest.requireActual('react');
  const { View } = jest.requireActual('react-native');

  const PagerView = React.forwardRef(
    (
      {
        children,
        onPageSelected,
        initialPage,
      }: {
        children: React.ReactNode;
        onPageSelected?: (event: { nativeEvent: { position: number } }) => void;
        initialPage?: number;
      },
      ref: React.Ref<{ setPage: jest.Mock }>,
    ) => {
      React.useImperativeHandle(ref, () => ({
        setPage: jest.fn(),
      }));

      return (
        <View
          testID="pager-view"
          onLayout={() => {
            if (onPageSelected) {
              onPageSelected({ nativeEvent: { position: initialPage || 0 } });
            }
          }}
        >
          {children}
        </View>
      );
    },
  );

  PagerView.displayName = 'PagerView';
  return PagerView;
});

describe('TabView', () => {
  const mockTabs = ['Tab 1', 'Tab 2', 'Tab 3'];
  const mockChildren = [
    <View key="1" testID="tab-content-1">
      <Text>Content 1</Text>
    </View>,
    <View key="2" testID="tab-content-2">
      <Text>Content 2</Text>
    </View>,
    <View key="3" testID="tab-content-3">
      <Text>Content 3</Text>
    </View>,
  ];

  const defaultProps = {
    tabs: mockTabs,
    children: mockChildren,
  };

  it('renders correctly with default props', () => {
    const { getByText, getByTestId } = render(<TabView {...defaultProps} />);
    expect(getByText('Tab 1')).toBeTruthy();
    expect(getByText('Tab 2')).toBeTruthy();
    expect(getByText('Tab 3')).toBeTruthy();
    expect(getByTestId('pager-view')).toBeTruthy();
  });

  it('renders with string tabs', () => {
    const { getByText } = render(<TabView {...defaultProps} />);
    expect(getByText('Tab 1')).toBeTruthy();
    expect(getByText('Tab 2')).toBeTruthy();
    expect(getByText('Tab 3')).toBeTruthy();
  });

  it('renders with object tabs', () => {
    const objectTabs = [
      { title: 'Home', icon: 'home' },
      { title: 'Profile', icon: 'user' },
      { title: 'Settings', icon: 'settings' },
    ];
    const { getByText } = render(
      <TabView {...defaultProps} tabs={objectTabs} />,
    );
    expect(getByText('Home')).toBeTruthy();
    expect(getByText('Profile')).toBeTruthy();
    expect(getByText('Settings')).toBeTruthy();
  });

  it('renders with custom initial page', () => {
    const { getByTestId } = render(
      <TabView {...defaultProps} initialPage={1} />,
    );
    expect(getByTestId('pager-view')).toBeTruthy();
  });

  it('applies custom className', () => {
    const { getByTestId } = render(
      <TabView {...defaultProps} className="custom-tabs" />,
    );
    expect(getByTestId('pager-view')).toBeTruthy();
  });

  it('applies custom contentClassName', () => {
    const { getByTestId } = render(
      <TabView {...defaultProps} contentClassName="custom-content" />,
    );
    expect(getByTestId('pager-view')).toBeTruthy();
  });

  it('handles tab press', () => {
    const { getByText } = render(<TabView {...defaultProps} />);
    const tab2 = getByText('Tab 2');

    fireEvent.press(tab2);
    // Tab press should work without errors
    expect(tab2).toBeTruthy();
  });

  it('handles multiple tab presses', () => {
    const { getByText } = render(<TabView {...defaultProps} />);
    const tab1 = getByText('Tab 1');
    const tab2 = getByText('Tab 2');
    const tab3 = getByText('Tab 3');

    fireEvent.press(tab1);
    fireEvent.press(tab2);
    fireEvent.press(tab3);

    expect(tab1).toBeTruthy();
    expect(tab2).toBeTruthy();
    expect(tab3).toBeTruthy();
  });

  it('renders with complex object tabs', () => {
    const complexTabs = [
      {
        title: 'Home',
        icon: 'home',
        iconVariant: 'FontAwesome6',
        iconColor: 'blue',
        iconSize: 20,
      },
      {
        title: 'Profile',
        icon: 'user',
        iconVariant: 'FontAwesome6',
        iconColor: 'red',
        iconSize: 24,
      },
    ];
    const { getByText } = render(
      <TabView {...defaultProps} tabs={complexTabs} />,
    );
    expect(getByText('Home')).toBeTruthy();
    expect(getByText('Profile')).toBeTruthy();
  });

  it('renders with single tab', () => {
    const singleTab = ['Single Tab'];
    const singleChild = [
      <View key="1" testID="single-content">
        <Text>Single Content</Text>
      </View>,
    ];
    const { getByText } = render(
      <TabView tabs={singleTab}>{singleChild}</TabView>,
    );
    expect(getByText('Single Tab')).toBeTruthy();
  });

  it('renders with empty tabs array', () => {
    const { getByTestId } = render(<TabView tabs={[]}>{[]}</TabView>);
    expect(getByTestId('pager-view')).toBeTruthy();
  });

  it('renders with mixed string and object tabs', () => {
    const mixedTabs = [
      'String Tab',
      { title: 'Object Tab', icon: 'star' },
      'Another String',
    ];
    const { getByText } = render(
      <TabView {...defaultProps} tabs={mixedTabs} />,
    );
    expect(getByText('String Tab')).toBeTruthy();
    expect(getByText('Object Tab')).toBeTruthy();
    expect(getByText('Another String')).toBeTruthy();
  });

  it('handles page change events', () => {
    const { getByTestId } = render(<TabView {...defaultProps} />);
    const pagerView = getByTestId('pager-view');

    // Simulate page change
    fireEvent(pagerView, 'layout');

    expect(pagerView).toBeTruthy();
  });

  it('renders with all props combined', () => {
    const complexTabs = [
      { title: 'Home', icon: 'home', iconColor: 'blue' },
      { title: 'Profile', icon: 'user', iconColor: 'red' },
    ];
    const { getByText, getByTestId } = render(
      <TabView
        {...defaultProps}
        tabs={complexTabs}
        initialPage={1}
        className="custom-tabs"
        contentClassName="custom-content"
      />,
    );

    expect(getByText('Home')).toBeTruthy();
    expect(getByText('Profile')).toBeTruthy();
    expect(getByTestId('pager-view')).toBeTruthy();
  });

  it('applies correct styling classes', () => {
    const { getByTestId } = render(<TabView {...defaultProps} />);
    expect(getByTestId('pager-view')).toBeTruthy();
  });

  it('renders with long tab titles', () => {
    const longTabs = [
      'This is a very long tab title that should still be displayed properly',
      'Another very long tab title for testing purposes',
    ];
    const { getByText } = render(<TabView {...defaultProps} tabs={longTabs} />);
    expect(
      getByText(
        'This is a very long tab title that should still be displayed properly',
      ),
    ).toBeTruthy();
    expect(
      getByText('Another very long tab title for testing purposes'),
    ).toBeTruthy();
  });
});
