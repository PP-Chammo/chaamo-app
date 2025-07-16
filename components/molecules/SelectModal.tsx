import React, { memo, useCallback, useMemo, useState } from 'react';

import { clsx } from 'clsx';
import {
  FlatList,
  Modal,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { Icon, Row } from '@/components/atoms';
import { TextChangeParams } from '@/domains';
import { getColor } from '@/utils/getColor';

import Header from './Header';

interface SelectModalProps {
  label?: string;
  placeholder?: string;
  value: string;
  required?: boolean;
  name: string;
  onChange: ({ name, value }: TextChangeParams) => void;
  options?: Option[];
  error?: string;
  inputClassName?: string;
  className?: string;
  modalClassName?: string;
}

interface Option {
  label: string;
  value: string;
}

const SelectModal: React.FC<SelectModalProps> = memo(function SelectModal({
  label,
  placeholder,
  value,
  required,
  onChange,
  name,
  options = [],
  error,
  className,
  inputClassName,
  modalClassName,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');

  const filteredData = useMemo(() => {
    return options.filter((option) =>
      option.label.toLowerCase().includes(search.toLowerCase()),
    );
  }, [options, search]);

  const handleSelect = useCallback(
    (optionValue: string) => {
      onChange({ name, value: optionValue });
      setIsOpen(false);
    },
    [onChange, name],
  );

  const selectedLabel = useMemo(
    () => options.find((o) => o.value === value)?.label || '',
    [options, value],
  );

  const listSeparator = useCallback(
    () => <View className={classes.listDivider} />,
    [],
  );

  return (
    <View className={clsx(classes.container, className)}>
      {label && (
        <Text className={classes.label}>
          {label}
          {required && <Text className={classes.required}>*</Text>}
        </Text>
      )}
      <View
        className={clsx(classes.inputContainer)}
        style={{ position: 'relative' }}
      >
        <TouchableOpacity
          activeOpacity={0.8}
          testID="select"
          className={clsx(classes.input, inputClassName)}
          onPress={() => setIsOpen((prevState) => !prevState)}
        >
          <Text
            className={clsx({
              [classes.inputText]: !!selectedLabel,
              [classes.inputTextPlaceholder]: !selectedLabel,
            })}
          >
            {selectedLabel || placeholder}
          </Text>
          <Icon
            name={isOpen ? 'chevron-up' : 'chevron-down'}
            size={24}
            color={getColor('slate-700')}
            className={classes.chevronIcon}
          />
        </TouchableOpacity>
      </View>
      {error && <Text className={classes.error}>{error}</Text>}
      <Modal
        visible={isOpen}
        onDismiss={() => setIsOpen(false)}
        animationType="fade"
        className={clsx(classes.modal, modalClassName)}
        onRequestClose={() => setIsOpen(false)}
      >
        <SafeAreaView className={classes.modalContentTop} />
        <SafeAreaView className={classes.modalContent}>
          <Header
            title={`Select ${label}`}
            onBackPress={() => setIsOpen(false)}
            className={classes.header}
          />
          <Row className={classes.searchContainer}>
            <Icon
              name="magnify"
              size={24}
              color={getColor('slate-700')}
              className={classes.searchIcon}
            />
            <TextInput
              placeholder="Search"
              value={search}
              onChangeText={(value) => setSearch(value)}
              className={classes.searchInput}
            />
          </Row>
          <View className={classes.listContainer}>
            <FlatList
              data={filteredData}
              keyExtractor={(item) => item.label}
              contentContainerClassName={classes.listContentContainer}
              ItemSeparatorComponent={listSeparator}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => handleSelect(item.value)}
                  className={classes.listItem}
                >
                  <Row between>
                    <Text>{item.label}</Text>
                    {value === item.value && (
                      <Icon
                        name="check"
                        size={24}
                        color={getColor('primary-500')}
                      />
                    )}
                  </Row>
                </TouchableOpacity>
              )}
            />
          </View>
        </SafeAreaView>
      </Modal>
    </View>
  );
});

export default SelectModal;

const classes = {
  container: 'flex gap-2',
  label: 'text-slate-500 font-medium text-md ml-4',
  required: 'text-red-500',
  inputContainer: 'relative',
  input:
    'flex flex-row justify-between items-center border border-slate-200 text-gray-700 rounded-lg px-4 bg-white h-[46px]',
  error: 'text-red-500 text-sm',
  inputText: 'text-gray-700',
  inputTextPlaceholder: 'text-gray-400',
  chevronIcon: 'mt-0.5',
  modal: 'flex-1 w-full bg-slate-500',
  header: 'bg-white',
  modalContentTop: 'bg-white',
  modalContent: 'flex-1 bg-slate-50',
  searchContainer: 'gap-2 m-4.5 bg-white border border-slate-200 rounded-lg',
  searchInput: 'text-gray-700 pr-4 h-[46px]',
  searchIcon: 'ml-3',
  listContainer: 'flex-1',
  listItem: 'p-4.5 bg-white',
  listContentContainer: 'gap-0',
  listDivider: 'h-0 mx-4.5 border-t border-primary-50',
};
