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
      <Pressable
        testID="modal-backdrop"
        onPress={onClose}
        className={classes.container}
      >
        <View
          testID="modal-content"
          className={clsx(classes.content, className)}
          onStartShouldSetResponder={() => true}
        >
          {children}
        </View>
      </Pressable>
    </RNModal>
  );
});

const classes = {
  container: 'flex-1 justify-center bg-black/40',
  content: 'bg-white mx-10 min-h-52 rounded-lg',
};

export default Modal;
