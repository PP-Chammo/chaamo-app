import React, {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { formatISO, parse } from 'date-fns';
import * as ImagePicker from 'expo-image-picker';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { cssInterop } from 'nativewind';
import { Alert, FlatList, View } from 'react-native';

import {
  Button,
  KeyboardView,
  Modal,
  ScreenContainer,
} from '@/components/atoms';
import {
  AutocompleteCardItem,
  Header,
  PhotoUpload,
  Select,
  TextArea,
  TextField,
} from '@/components/molecules';
import { conditions, conditionSells } from '@/constants/condition';
import { currencySymbolMap } from '@/constants/currencies';
import {
  ListingType,
  MasterCards,
  useCreateListingsMutation,
  useCreateUserCardMutation,
  useGetCategoriesQuery,
  useGetMasterCardsAutocompleteLazyQuery,
  useGetVwChaamoDetailLazyQuery,
} from '@/generated/graphql';
import useDebounce from '@/hooks/useDebounce';
import { initialSellFormState, useSellFormVar } from '@/hooks/useSellFormVar';
import { useUserVar } from '@/hooks/useUserVar';
import { SellFormStore } from '@/stores/sellFormStore';
import { SupportedCurrency } from '@/types/currency';
import { getColor } from '@/utils/getColor';
import { structuredClone } from '@/utils/structuredClone';
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

export default function SellScreen() {
  const { cardId } = useLocalSearchParams();
  const [user] = useUserVar();
  const [form, setForm] = useSellFormVar();

  const { data: categoriesData } = useGetCategoriesQuery();

  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [errors, setErrors] = useState<ValidationErrors<SellFormStore>>({});
  const [getAutocompleteList, { data: masterCards }] =
    useGetMasterCardsAutocompleteLazyQuery();
  const [createListings] = useCreateListingsMutation();
  const [createUserCard] = useCreateUserCardMutation();
  const [getDetail] = useGetVwChaamoDetailLazyQuery();

  const userCurrencySymbol = useMemo(() => {
    if (!user) return '$';
    const currency = user.profile?.currency;
    return currencySymbolMap[currency as SupportedCurrency];
  }, [user]);

  const autocompleteList = useMemo(() => {
    return masterCards?.master_cardsCollection?.edges ?? [];
  }, [masterCards?.master_cardsCollection?.edges]);

  const categories = useMemo(() => {
    const list = categoriesData?.categoriesCollection?.edges ?? [];
    if (list.length > 0) {
      return list.map((category) => ({
        value: String(category?.node.id),
        label: category?.node.name,
      }));
    }
  }, [categoriesData?.categoriesCollection?.edges]);

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

  const requiredFields = useMemo<(keyof SellFormStore)[]>(() => {
    const fields: (keyof SellFormStore)[] = [
      'title',
      'description',
      'category_id',
      'condition',
      'listing_type',
    ];
    if (form.listing_type === 'sell') fields.push('start_price');
    if (form.listing_type === 'auction')
      fields.push('end_time', 'start_price', 'reserved_price');
    return fields;
  }, [form.listing_type]);

  const isFormValid = useMemo(
    () =>
      requiredFields.every(
        (field) => form[field] && form[field].toString().trim() !== '',
      ),
    [form, requiredFields],
  );

  useFocusEffect(
    useCallback(() => {
      if (cardId) {
        getDetail({
          variables: {
            filter: { id: { eq: cardId } },
          },
          onCompleted: ({ vw_chaamo_cardsCollection }) => {
            if (vw_chaamo_cardsCollection?.edges?.length) {
              const detail = vw_chaamo_cardsCollection.edges[0].node;
              console.log({ detail });

              // setForm(detail);
            }
          },
        });
      }
    }, [cardId, getDetail]),
  );

  const handleAutocompletePress = useCallback(
    (masterCard: MasterCards) => {
      setForm({
        title: masterCard.id ? masterCard.name : searchText,
        master_card_id: masterCard.id,
      });
      setSearchText(masterCard.name);
      setShowModal(false);
    },
    [setForm, searchText],
  );

  const handleChange = useCallback(
    ({ name, value }: { name: string; value: string }) => {
      setForm({ [name]: value });
    },
    [setForm],
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
      quality: 0.8,
    });
    if (result.canceled || !result.assets.length)
      return Alert.alert('No image selected');
    const selectedImage = result.assets[0];
    setForm({ imageUrl: selectedImage.uri });
  }, [setForm]);

  const handleRemoveImage = useCallback(() => {
    setForm({ imageUrl: '' });
  }, [setForm]);

  const handleSubmit = useCallback(async () => {
    setLoading(true);
    const requiredFields: (keyof SellFormStore)[] = [
      'imageUrl',
      'title',
      'description',
      'category_id',
      'condition',
      'listing_type',
    ];
    if (form.listing_type === 'sell') {
      requiredFields.push('start_price');
    }
    if (form.listing_type === 'auction') {
      requiredFields.push('end_time', 'start_price', 'reserved_price');
    }
    const validationErrors = validateRequired(
      form as unknown as Record<string, string | number>,
      requiredFields,
    );
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      const uploadedUrl = await uploadToBucket(
        form.imageUrl,
        'chaamo',
        'user_cards',
      );
      createUserCard({
        variables: {
          objects: [
            {
              user_id: user?.id,
              category_id: Number(form.category_id),
              ...(form.master_card_id
                ? {
                    master_card_id: form.master_card_id,
                    custom_name: form.title,
                  }
                : {
                    custom_name: form.title,
                  }),
              description: form.description,
              condition: form.condition,
              grading_company: form.grading_company,
              grade: '0.0',
              image_url: uploadedUrl,
            },
          ],
        },
        onCompleted: ({ insertIntouser_cardsCollection }) => {
          if (insertIntouser_cardsCollection?.records?.length) {
            const userCardId = insertIntouser_cardsCollection.records[0].id;
            createListings({
              variables: {
                objects: [
                  {
                    user_card_id: userCardId,
                    seller_id: user?.id,
                    listing_type: form.listing_type,
                    currency: user?.profile?.currency,
                    // Sell
                    ...(form.listing_type === ListingType.SELL
                      ? {
                          start_price: Number(form.start_price).toFixed(2),
                        }
                      : {}),
                    // Auction
                    ...(form.listing_type === ListingType.AUCTION
                      ? {
                          start_price: Number(form.start_price).toFixed(2),
                          reserve_price: Number(form.reserved_price).toFixed(2),
                          start_time: formatISO(new Date()),
                          end_time: formatISO(
                            parse(form.end_time, 'dd/MM/yyyy', new Date()),
                          ),
                        }
                      : {}),
                  },
                ],
              },
              onCompleted: ({ insertIntolistingsCollection }) => {
                if (insertIntolistingsCollection?.records?.length) {
                  if (form.listing_type === ListingType.PORTFOLIO) {
                    Alert.alert('Success!', 'Your portfolio has been saved.', [
                      {
                        text: 'OK',
                        onPress: () => {
                          setForm(structuredClone(initialSellFormState));
                          router.replace('/(tabs)/home');
                        },
                      },
                    ]);
                  } else {
                    setForm({
                      user_card_id: userCardId,
                      listing_id: insertIntolistingsCollection.records[0].id,
                    });
                    setLoading(false);
                    router.push('/screens/select-ad-package');
                  }
                }
              },
              onError: console.log,
            });
          }
        },
        onError: console.log,
      });
    } else {
      setLoading(false);
    }
  }, [
    form,
    createUserCard,
    user?.id,
    createListings,
    user?.profile?.currency,
    setForm,
  ]);

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
            name="category_id"
            label="Category"
            required
            placeholder="Select Category"
            value={form.category_id}
            onChange={handleChange}
            options={categories}
            inputClassName={classes.input}
            error={errors.category_id}
          />
          <Select
            name="condition"
            label="Condition"
            required
            placeholder="Select Card Condition"
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
            placeholder="Select Listing Type"
            value={form.listing_type}
            onChange={handleChange}
            options={conditionSells}
            inputClassName={classes.input}
            error={errors.listing_type}
          />
          {form.listing_type === 'sell' && (
            <TextField
              name="start_price"
              label="Price"
              placeholder="Enter price"
              value={form.start_price}
              onChange={handleChange}
              keyboardType="numeric"
              required
              inputClassName={classes.input}
              leftLabel={userCurrencySymbol}
              error={errors.start_price}
            />
          )}
          {form.listing_type === 'auction' && (
            <Fragment>
              <TextField
                type="date"
                name="end_time"
                label="Auction End Date"
                value={form.end_time}
                onChange={handleChange}
                required
                inputClassName={classes.input}
                rightIcon="calendar"
                rightIconVariant="SimpleLineIcons"
                rightIconSize={20}
                rightIconColor={getColor('slate-500')}
                error={errors.end_time}
              />
              <TextField
                name="start_price"
                label="Minimum Price"
                value={form.start_price}
                onChange={handleChange}
                keyboardType="numeric"
                required
                inputClassName={classes.input}
                leftLabel={userCurrencySymbol}
                error={errors.start_price}
              />
              <TextField
                name="reserved_price"
                label="Reserved Price"
                value={form.reserved_price}
                onChange={handleChange}
                keyboardType="numeric"
                required
                inputClassName={classes.input}
                leftLabel={userCurrencySymbol}
                error={errors.reserved_price}
              />
            </Fragment>
          )}
        </View>
      </KeyboardView>
      <View className={classes.buttonContainer}>
        <Button
          onPress={handleSubmit}
          disabled={!isFormValid || !form.imageUrl || loading}
          loading={loading}
        >
          Post Your Card
        </Button>
      </View>
      <Modal
        visible={showModal}
        onClose={() => setShowModal(false)}
        className={classes.modal}
      >
        <TextField
          name="searchText"
          value={searchText}
          placeholder="Search card for reference"
          onChange={({ value }) => setSearchText(value)}
        />
        <View className={classes.modalContainer}>
          <FlatList
            showsVerticalScrollIndicator={false}
            data={[
              ...autocompleteList,
              ...(searchText.length > 2
                ? [{ node: { id: null, name: `Use title "${searchText}"` } }]
                : []),
            ]}
            renderItem={({ item }) => (
              <AutocompleteCardItem
                onPress={() =>
                  handleAutocompletePress(item.node as MasterCards)
                }
                imageUrl={item.node?.canonical_image_url ?? ''}
                name={item.node?.name}
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
  container: 'flex-1 p-4.5 mb-32 gap-4.5',
  pickerModal:
    'absolute left-0 right-0 bottom-0 bg-white p-4 rounded-t-2xl border-t border-gray-200 z-50',
  pickerOption: 'py-3',
  pickerOptionLabel: 'text-lg text-gray-800',
  pickerCancelBtn: 'mt-2',
  input: 'bg-white leading-5',
  modalContainer: 'flex-1',
  modal: '!mx-4.5 w-[calc(100%-1rem)] h-[70%] p-4.5 !bg-slate-100 gap-4.5',
  list: 'flex-1',
  listContainer: 'gap-2',
  buttonContainer: 'p-4.5 mb-4.5',
};
