import { memo } from 'react';

import { clsx } from 'clsx';
import { Pressable, Modal as RNModal, View } from 'react-native';

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  testID?: string;
}

const Modal = memo(function Modal({
  visible,
  onClose,
  children,
  className,
  testID,
}: ModalProps) {
  return (
    <RNModal
      testID={testID}
      visible={visible}
      animationType="fade"
      statusBarTranslucent
      transparent
      onRequestClose={onClose}
    >
      <View className={classes.container}>
        <Pressable
          testID="modal-backdrop"
          onPress={onClose}
          className={classes.modalBackdrop}
        />
        <View
          testID="modal-content"
          className={clsx(classes.content, className)}
        >
          {children}
        </View>
      </View>
    </RNModal>
  );
});

const classes = {
  container: 'flex-1 justify-center bg-black/40',
  content: 'bg-white mx-10 min-h-52 rounded-lg',
  modalBackdrop: 'absolute inset-0',
};

export default Modal;
