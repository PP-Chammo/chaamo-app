import React, { memo, useEffect, useMemo } from 'react';

import { Dimensions, Modal, TouchableOpacity, View } from 'react-native';

interface ContextMenuProps {
  visible: boolean;
  onClose: () => void;
  triggerRef: React.RefObject<View | null>;
  children: React.ReactNode;
  menuHeight?: number;
  testID?: string;
}

const ContextMenu: React.FC<ContextMenuProps> = memo(function ContextMenu({
  visible,
  onClose,
  triggerRef,
  children,
  menuHeight = 50,
  testID,
}) {
  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
  const menuWidth = 216;

  const calculatePosition = useMemo(() => {
    return () => {
      return new Promise<{ x: number; y: number }>((resolve) => {
        triggerRef.current?.measure(
          (
            x: number,
            y: number,
            width: number,
            height: number,
            pageX: number,
            pageY: number,
          ) => {
            // Calculate position to ensure menu stays within screen bounds
            let menuX = pageX + width - menuWidth;
            let menuY = pageY + height - menuHeight;

            // Adjust if menu would go off screen
            if (menuX < 20) menuX = 20;
            if (menuX + menuWidth > screenWidth - 20)
              menuX = screenWidth - menuWidth - 20;
            if (menuY + menuHeight > screenHeight - 100)
              menuY = pageY - menuHeight - 10;

            resolve({ x: menuX, y: menuY });
          },
        );
      });
    };
  }, [triggerRef, menuWidth, menuHeight, screenWidth, screenHeight]);

  const [menuPosition, setMenuPosition] = React.useState({ x: 0, y: 0 });

  useEffect(() => {
    if (visible) {
      calculatePosition().then(setMenuPosition);
    }
  }, [visible, calculatePosition]);

  return (
    <Modal
      testID={testID}
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        className={classes.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View
          className={classes.menu}
          style={{
            left: menuPosition.x,
            top: menuPosition.y,
          }}
        >
          {children}
        </View>
      </TouchableOpacity>
    </Modal>
  );
});

const classes = {
  overlay: 'flex-1',
  menu: 'absolute bg-white rounded-lg p-3 min-w-[216px] shadow-lg border-2 border-slate-100 gap-3',
};

export default ContextMenu;
