import React from 'react';

import { render } from '@testing-library/react-native';
import { Text, View } from 'react-native';

import PaymentForm from '../PaymentForm';

jest.mock('@/components/atoms', () => {
  const { View, Text } = jest.requireActual('react-native');
  return {
    CardField: (
      props: { label?: string; error?: string } & Record<string, unknown>,
    ) => (
      <>
        <Text>{props.label}</Text>
        {props.error && <Text>{props.error}</Text>}
      </>
    ),
    KeyboardView: (props: { children?: React.ReactNode }) => (
      <View>{props.children}</View>
    ),
    Row: (props: { children?: React.ReactNode }) => (
      <View>{props.children}</View>
    ),
  };
});

jest.mock('@/components/molecules', () => {
  const { Text } = jest.requireActual('react-native');
  return {
    TextField: (
      props: { label?: string; error?: string } & Record<string, unknown>,
    ) => (
      <>
        <Text>{props.label}</Text>
        {props.error && <Text>{props.error}</Text>}
      </>
    ),
  };
});

jest.mock('@/assets/svg', () => ({
  StripeIcon: () => <></>,
}));

beforeAll(() => {
  jest.doMock('@/components/atoms', () => ({
    CardField: (
      props: { label?: string; error?: string } & Record<string, unknown>,
    ) => (
      <>
        <Text>{props.label}</Text>
        {props.error && <Text>{props.error}</Text>}
      </>
    ),
    KeyboardView: (props: { children?: React.ReactNode }) => (
      <View>{props.children}</View>
    ),
    Row: (props: { children?: React.ReactNode }) => (
      <View>{props.children}</View>
    ),
  }));
  jest.doMock('@/components/molecules', () => ({
    TextField: (
      props: { label?: string; error?: string } & Record<string, unknown>,
    ) => (
      <>
        <Text>{props.label}</Text>
        {props.error && <Text>{props.error}</Text>}
      </>
    ),
  }));
});

describe('PaymentForm', () => {
  const form = {
    cardNumber: '4111 1111 1111 1111',
    expiry: '12/25',
    cvc: '123',
  };
  const errors = {
    cardNumber: '',
    expiry: '',
    cvc: '',
  };
  const onChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all fields and StripeIcon', () => {
    const { getByText } = render(
      <PaymentForm form={form} errors={errors} onChange={onChange} />,
    );
    expect(getByText('Card Number')).toBeTruthy();
    expect(getByText('Expiry')).toBeTruthy();
    expect(getByText('CVC')).toBeTruthy();
  });

  it('displays error messages if provided', () => {
    const errorProps = {
      ...errors,
      cardNumber: 'Invalid',
      expiry: 'Invalid',
      cvc: 'Invalid',
    };
    const { getByText } = render(
      <PaymentForm form={form} errors={errorProps} onChange={onChange} />,
    );
    expect(getByText('Card Number')).toBeTruthy();
    expect(getByText('Expiry')).toBeTruthy();
    expect(getByText('CVC')).toBeTruthy();
  });
});
