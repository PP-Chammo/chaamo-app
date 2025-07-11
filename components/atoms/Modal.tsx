import { memo } from 'react';

import { clsx } from 'clsx';
import { Pressable, Modal as RNModal, View } from 'react-native';

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

const Modal = memo(function Modal({
  visible,
  onClose,
  children,
  className,
}: ModalProps) {
  return (
    <RNModal
      visible={visible}
      animationType="fade"
      statusBarTranslucent
      transparent
      onRequestClose={onClose}
    >
      <Pressable onPress={onClose} className={classes.container}>
        <View
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
