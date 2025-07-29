import React, {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { formatISO, parse } from 'date-fns';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { cssInterop } from 'nativewind';
import { Alert, FlatList, View } from 'react-native';

import {
  Button,
  KeyboardView,
  Modal,
  ScreenContainer,
} from '@/components/atoms';
import PhotoUpload from '@/components/atoms/PhotoUpload';
import {
  AutocompleteCardItem,
  Header,
  Select,
  TextArea,
  TextField,
} from '@/components/molecules';
import { conditions, conditionSells } from '@/constants/condition';
import {
  CardCondition,
  ListingType,
  MasterCards,
  useGetMasterCardsAutocompleteLazyQuery,
  useInsertListingsMutation,
  useInsertUserCardMutation,
  useUpdateUserCardMutation,
} from '@/generated/graphql';
import useDebounce from '@/hooks/useDebounce';
import { useProfileVar } from '@/hooks/useProfileVar';
import { getColor } from '@/utils/getColor';
import { uploadToBucket } from '@/utils/supabase';
import { validateRequired, ValidationErrors } from '@/utils/validate';

cssInterop(FlatList, {
  className: {
    target: 'style',
  },
  contentContainerClassName: {
    target: 'contentContainerStyle',
  },
});

type SellForm = {
  imageUrl: string;
  title: string;
  description: string;
  condition: CardCondition;
  listing_type: ListingType;
  currency: string;
  price: string;
  endDate: string;
  minPrice: string;
  reservedPrice: string;

  master_card_id: string;
  grading_company: string;
  grade: number;
};

const initialForm: SellForm = {
  imageUrl: '',
  title: '',
  description: '',
  condition: CardCondition.RAW,
  listing_type: ListingType.PORTFOLIO,
  currency: '$',
  price: '',
  endDate: '',
  minPrice: '',
  reservedPrice: '',
  // this below input get from autocomplete
  master_card_id: '',
  grading_company: '',
  grade: 0,
};

export default function SellScreen() {
  const [profile] = useProfileVar();

  const [form, setForm] = useState<SellForm>(initialForm);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [errors, setErrors] = useState<ValidationErrors<typeof initialForm>>(
    {},
  );
  const [getAutocompleteList, { data: masterCards }] =
    useGetMasterCardsAutocompleteLazyQuery();
  const [insertListings] = useInsertListingsMutation();
  const [insertUserCard] = useInsertUserCardMutation();
  const [updateUserCard] = useUpdateUserCardMutation();

  const debouncedSearch = useDebounce(searchText, 700);
  useEffect(() => {
    if (debouncedSearch.length >= 2) {
      const keywords = searchText.trim().split(/\s+/);
      getAutocompleteList({
        variables: {
          filter: {
            and: keywords.map((word) => ({ name: { ilike: `%${word}%` } })),
          },
          last: 50,
        },
      });
    }
    // need disable exahustive deps to keep debounce works
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, getAutocompleteList]);

  const requiredFields = useMemo<(keyof typeof initialForm)[]>(() => {
    const fields: (keyof typeof initialForm)[] = [
      'title',
      'description',
      'condition',
      'listing_type',
    ];
    if (form.listing_type === 'sell') fields.push('price');
    if (form.listing_type === 'auction')
      fields.push('endDate', 'minPrice', 'reservedPrice');
    return fields;
  }, [form.listing_type]);

  const isFormValid = useMemo(
    () =>
      requiredFields.every(
        (field) => form[field] && form[field].toString().trim() !== '',
      ),
    [form, requiredFields],
  );

  const handleAutocompletePress = useCallback((masterCard: MasterCards) => {
    setForm((prev) => ({
      ...prev,
      title: masterCard.name,
      master_card_id: masterCard.id,
    }));
    setSearchText(masterCard.name);
    setShowModal(false);
  }, []);

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

  const handleSubmit = useCallback(async () => {
    setLoading(true);
    const requiredFields: (keyof typeof initialForm)[] = [
      'title',
      'description',
      'condition',
      'listing_type',
    ];
    if (form.listing_type === 'sell') {
      requiredFields.push('price');
    }
    if (form.listing_type === 'auction') {
      requiredFields.push('endDate', 'minPrice', 'reservedPrice');
    }
    const validationErrors = validateRequired(form, requiredFields);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      const uploadedUrl = await uploadToBucket(
        form.imageUrl,
        'chaamo',
        'user_cards',
      );
      insertUserCard({
        variables: {
          objects: [
            {
              user_id: profile?.id,
              master_card_id: form.master_card_id,
              condition: form.condition,
              grading_company: form.grading_company,
              grade: '0.0',
              user_images: uploadedUrl,
            },
          ],
        },
        onCompleted: ({ insertIntouser_cardsCollection }) => {
          if (insertIntouser_cardsCollection?.records?.length) {
            const userCardId = insertIntouser_cardsCollection.records[0].id;
            insertListings({
              variables: {
                objects: [
                  {
                    user_card_id: userCardId,
                    seller_id: profile?.id,
                    listing_type: form.listing_type,
                    description: form.description,

                    // Sell
                    ...(form.listing_type === ListingType.SELL
                      ? {
                          currency: form.currency ?? '$',
                          price: Number(form.price).toFixed(2),
                          accepts_offers: true,
                        }
                      : {}),

                    // Auction
                    ...(form.listing_type === ListingType.AUCTION
                      ? {
                          currency: form.currency ?? '$',
                          start_price: Number(form.minPrice).toFixed(2),
                          reserve_price: Number(form.reservedPrice).toFixed(2),
                          start_time: formatISO(new Date()),
                          ends_at: formatISO(
                            parse(form.endDate, 'dd/MM/yyyy', new Date()),
                          ),
                        }
                      : {}),
                  },
                ],
              },
              onCompleted: ({ insertIntolistingsCollection }) => {
                if (insertIntolistingsCollection?.records?.length) {
                  updateUserCard({
                    variables: {
                      set: {
                        is_in_listing: true,
                      },
                      filter: {
                        id: { eq: userCardId },
                      },
                    },
                  });
                  setForm(initialForm);
                  setLoading(false);
                  Alert.alert('Posted!', 'Your card has been posted.');
                }
              },
            });
          }
        },
      });
    } else {
      setLoading(false);
    }
  }, [form, insertListings, insertUserCard, profile?.id, updateUserCard]);

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
            onPress={() => setShowModal(true)}
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
            name="condition"
            label="Condition"
            required
            placeholder="--Please Select--"
            value={form.condition}
            onChange={handleChange}
            options={conditions}
            inputClassName={classes.input}
            error={errors.condition}
          />
          <Select
            name="listing_type"
            label="Listing Type"
            required
            placeholder="--Please Select--"
            value={form.listing_type}
            onChange={handleChange}
            options={conditionSells}
            inputClassName={classes.input}
            error={errors.listing_type}
          />
          {form.listing_type === 'sell' && (
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
          {form.listing_type === 'auction' && (
            <Fragment>
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
            </Fragment>
          )}
          <Button
            className={classes.submitBtn}
            textClassName={classes.submitBtnText}
            onPress={handleSubmit}
            disabled={!isFormValid || loading}
            loading={loading}
          >
            Post Your Card
          </Button>
        </View>
      </KeyboardView>
      <Modal
        visible={showModal}
        onClose={() => setShowModal(false)}
        className={classes.modal}
      >
        <TextField
          name="searchText"
          value={searchText}
          placeholder="Search for a card"
          onChange={({ value }) => setSearchText(value)}
        />
        <View className={classes.modalContainer}>
          <FlatList
            showsVerticalScrollIndicator={false}
            data={masterCards?.master_cardsCollection?.edges ?? []}
            renderItem={({ item }) => (
              <AutocompleteCardItem
                onPress={() =>
                  handleAutocompletePress(item.node as MasterCards)
                }
                imageUrl={item.node.canonical_image_url ?? ''}
                name={item.node.name}
                category={item.node.categories?.name ?? ''}
              />
            )}
            className={classes.list}
            contentContainerClassName={classes.listContainer}
          />
        </View>
      </Modal>
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
  modalContainer: 'h-[70%]',
  modal: '!mx-4.5 w-[calc(100%-1rem)] p-4.5 !bg-slate-100 gap-4.5',
  list: 'flex-1',
  listContainer: 'gap-2',
};
