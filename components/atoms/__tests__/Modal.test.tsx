import React from 'react';

import { fireEvent, render } from '@testing-library/react-native';

import Modal from '../Modal';

describe('Modal', () => {
  it('renders when visible', () => {
    const { getByTestId } = render(
      <Modal visible onClose={jest.fn()}>
        <></>
      </Modal>,
    );
    expect(getByTestId('modal-backdrop')).toBeTruthy();
    expect(getByTestId('modal-content')).toBeTruthy();
  });
  it('does not render when not visible', () => {
    const { queryByTestId } = render(
      <Modal visible={false} onClose={jest.fn()}>
        <></>
      </Modal>,
    );
    expect(queryByTestId('modal-backdrop')).toBeNull();
  });
  it('calls onClose when requested', () => {
    const onClose = jest.fn();
    const { getByTestId } = render(
      <Modal visible onClose={onClose}>
        <></>
      </Modal>,
    );
    fireEvent(getByTestId('modal-backdrop'), 'requestClose');
    expect(onClose).toHaveBeenCalled();
  });
});
