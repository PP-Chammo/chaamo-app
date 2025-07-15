import React from 'react';

import { fireEvent, render } from '@testing-library/react-native';

import PhotoUpload from '../PhotoUpload';
describe('PhotoUpload', () => {
  it('renders correctly with no image', () => {
    const { getByText } = render(<PhotoUpload onPick={jest.fn()} />);
    expect(getByText('Add Photo')).toBeTruthy();
  });
  it('calls onPick when photo is selected', () => {
    const onPick = jest.fn();
    const { getByTestId } = render(<PhotoUpload onPick={onPick} />);
    fireEvent.press(getByTestId('upload-photo-btn'));
    expect(onPick).toHaveBeenCalled();
  });
  it('renders with image and calls onRemove', () => {
    const onRemove = jest.fn();
    const { getByTestId } = render(
      <PhotoUpload
        imageUrl="http://test.com/image.jpg"
        onPick={jest.fn()}
        onRemove={onRemove}
      />,
    );
    fireEvent.press(getByTestId('remove-photo-btn'));
    expect(onRemove).toHaveBeenCalled();
  });
  it('does not call onPick when loading', () => {
    const onPick = jest.fn();
    const { getByTestId } = render(<PhotoUpload onPick={onPick} loading />);
    fireEvent.press(getByTestId('upload-photo-btn'));
    expect(onPick).not.toHaveBeenCalled();
  });
});
