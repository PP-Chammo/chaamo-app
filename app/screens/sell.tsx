import React, { useCallback, useMemo, useState } from 'react';

import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { Alert, View } from 'react-native';

import { Button, KeyboardView, ScreenContainer } from '@/components/atoms';
import PhotoUpload from '@/components/atoms/PhotoUpload';
import { Header, Select, TextArea, TextField } from '@/components/molecules';
import { conditions, conditionSells } from '@/constants/condition';
import { getColor } from '@/utils/getColor';
import { validateRequired, ValidationErrors } from '@/utils/validate';

const initialForm = {
  imageUrl: '',
  title: '',
  description: '',
  condition1: '',
  condition2: '',
  price: '',
  endDate: '',
  minPrice: '',
  reservedPrice: '',
};

export default function SellScreen() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState<ValidationErrors<typeof initialForm>>(
    {},
  );

  const handleChange = useCallback(
    ({ name, value }: { name: string; value: string }) => {
      setForm((prev) => ({ ...prev, [name]: value }));
    },
    [],
  );

  const handlePickImage = useCallback(async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      return Alert.alert(
        'Permission required',
        'We need permission to access your photos.',
      );
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 0.8,
    });
    if (result.canceled || !result.assets.length)
      return Alert.alert('No image selected');
    const selectedImage = result.assets[0];
    setForm((prev) => ({ ...prev, imageUrl: selectedImage.uri }));
  }, []);

  const handleRemoveImage = useCallback(() => {
    setForm((prev) => ({ ...prev, imageUrl: '' }));
  }, []);

  const handleSubmit = useCallback(() => {
    const requiredFields: (keyof typeof initialForm)[] = [
      'title',
      'description',
      'condition1',
      'condition2',
    ];
    if (form.condition2 === 'sell') requiredFields.push('price');
    if (form.condition2 === 'auction')
      requiredFields.push('endDate', 'minPrice', 'reservedPrice');
    const validationErrors = validateRequired(form, requiredFields);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;
    Alert.alert('Posted!', 'Your card has been posted.');
  }, [form]);

  const requiredFields = useMemo<(keyof typeof initialForm)[]>(() => {
    const fields: (keyof typeof initialForm)[] = [
      'title',
      'description',
      'condition1',
      'condition2',
    ];
    if (form.condition2 === 'sell') fields.push('price');
    if (form.condition2 === 'auction')
      fields.push('endDate', 'minPrice', 'reservedPrice');
    return fields;
  }, [form.condition2]);

  const isFormValid = useMemo(
    () =>
      requiredFields.every(
        (field) => form[field] && form[field].toString().trim() !== '',
      ),
    [form, requiredFields],
  );

  return (
    <ScreenContainer>
      <Header
        title="Sell Your Card"
        onBackPress={() => router.push('/(tabs)/home')}
      />
      <KeyboardView>
        <View className={classes.container}>
          <PhotoUpload
            imageUrl={form.imageUrl}
            onPick={handlePickImage}
            onRemove={form.imageUrl ? handleRemoveImage : undefined}
          />
          <TextField
            name="title"
            label="Title"
            placeholder="E.g: Lamine Yamal"
            value={form.title}
            onChange={handleChange}
            required
            inputClassName={classes.input}
            error={errors.title}
          />
          <TextArea
            name="description"
            label="Description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            required
            inputClassName={classes.input}
          />
          <Select
            name="condition1"
            label="Condition"
            required
            placeholder="--Please Select--"
            value={form.condition1}
            onChange={handleChange}
            options={conditions}
            inputClassName={classes.input}
            error={errors.condition1}
          />
          <Select
            name="condition2"
            label="Condition"
            required
            placeholder="--Please Select--"
            value={form.condition2}
            onChange={handleChange}
            options={conditionSells}
            inputClassName={classes.input}
            error={errors.condition2}
          />
          {form.condition2 === 'sell' && (
            <TextField
              name="price"
              label="Price"
              placeholder="Enter price"
              value={form.price}
              onChange={handleChange}
              required
              inputClassName={classes.input}
              leftIcon="attach-money"
              leftIconVariant="MaterialIcons"
              leftIconSize={20}
              leftIconColor={getColor('slate-500')}
              error={errors.price}
            />
          )}
          {form.condition2 === 'auction' && (
            <>
              <TextField
                type="date"
                name="endDate"
                label="Select Auction End Date"
                value={form.endDate}
                onChange={handleChange}
                required
                inputClassName={classes.input}
                rightIcon="calendar"
                rightIconVariant="SimpleLineIcons"
                rightIconSize={20}
                rightIconColor={getColor('slate-500')}
                error={errors.endDate}
              />
              <TextField
                name="minPrice"
                label="Set Minimum Price"
                value={form.minPrice}
                onChange={handleChange}
                required
                inputClassName={classes.input}
                leftIcon="attach-money"
                leftIconVariant="MaterialIcons"
                leftIconSize={20}
                leftIconColor={getColor('slate-500')}
                error={errors.minPrice}
              />
              <TextField
                name="reservedPrice"
                label="Reserved Price"
                value={form.reservedPrice}
                onChange={handleChange}
                required
                inputClassName={classes.input}
                leftIcon="attach-money"
                leftIconVariant="MaterialIcons"
                leftIconSize={20}
                leftIconColor={getColor('slate-500')}
                error={errors.reservedPrice}
              />
            </>
          )}
          <Button
            className={classes.submitBtn}
            textClassName={classes.submitBtnText}
            onPress={handleSubmit}
            disabled={!isFormValid}
          >
            Post Your Card
          </Button>
        </View>
      </KeyboardView>
    </ScreenContainer>
  );
}

const classes = {
  container: 'flex-1 p-4.5 gap-4.5',
  pickerModal:
    'absolute left-0 right-0 bottom-0 bg-white p-4 rounded-t-2xl border-t border-gray-200 z-50',
  pickerOption: 'py-3',
  pickerOptionLabel: 'text-lg text-gray-800',
  pickerCancelBtn: 'mt-2',
  submitBtn: 'mt-8 rounded-full bg-primary-100',
  submitBtnText: 'text-primary-500 text-base font-semibold',
  input: 'bg-white leading-5',
};
