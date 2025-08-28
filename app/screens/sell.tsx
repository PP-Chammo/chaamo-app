import React, {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { useFocusEffect } from '@react-navigation/native';
import { formatISO, parse } from 'date-fns';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { cssInterop } from 'nativewind';
import { Alert, FlatList, View, TouchableOpacity } from 'react-native';

import {
  Button,
  KeyboardView,
  Loading,
  Modal,
  ScreenContainer,
} from '@/components/atoms';
import Icon from '@/components/atoms/Icon';
import {
  AutocompleteCardItem,
  Header,
  PhotoUpload,
  Select,
  TextArea,
  TextField,
} from '@/components/molecules';
import { Camera } from '@/components/organisms';
import { conditions, conditionSells } from '@/constants/condition';
import { currencySymbolMap } from '@/constants/currencies';
import {
  CardCondition,
  ListingsInsertInput,
  ListingsUpdateInput,
  ListingType,
  MasterCards,
  useCreateListingsMutation,
  useCreateUserCardMutation,
  useGetCategoriesQuery,
  useGetMasterCardsAutocompleteLazyQuery,
  useGetVwChaamoDetailLazyQuery,
  UserCardsInsertInput,
  UserCardsUpdateInput,
  useUpdateListingsMutation,
  useUpdateUserCardMutation,
} from '@/generated/graphql';
import useDebounce from '@/hooks/useDebounce';
import { useImageCapturedVar } from '@/hooks/useImageCapturedVar';
import { initialSellFormState, useSellFormVar } from '@/hooks/useSellFormVar';
import { useUserVar } from '@/hooks/useUserVar';
import { imageCapturedStore } from '@/stores/imageCapturedStore';
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
  const [
    getAutocompleteList,
    { data: masterCards, loading: autocompleteLoading },
  ] = useGetMasterCardsAutocompleteLazyQuery();
  const [createListings] = useCreateListingsMutation();
  const [updateListings] = useUpdateListingsMutation();
  const [createUserCard] = useCreateUserCardMutation();
  const [updateUserCard] = useUpdateUserCardMutation();
  const [getDetail, { data }] = useGetVwChaamoDetailLazyQuery();
  const hasProcessedCard = useRef(false);
  const hasResetForm = useRef(false);

  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [imageCaptured, setImageCaptured] = useImageCapturedVar();

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

  useEffect(() => {
    if (
      imageCaptured?.uri &&
      imageCaptured.uri.trim() !== '' &&
      !form.imageUrls.includes(imageCaptured.uri)
    ) {
      setForm({
        ...form,
        imageUrls: [...form.imageUrls, imageCaptured.uri],
      });
      setImageCaptured(imageCapturedStore);
    }
    // keep this to avoid infinite loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageCaptured.uri]);

  useFocusEffect(
    useCallback(() => {
      if (cardId && !hasProcessedCard.current) {
        getDetail({
          variables: {
            filter: { user_card_id: { eq: cardId } },
          },
        });
      }
    }, [cardId, getDetail]),
  );

  useFocusEffect(
    useCallback(() => {
      if (cardId) {
        const detail = data?.vw_chaamo_cardsCollection?.edges[0]?.node;
        if (detail && !hasProcessedCard.current) {
          hasProcessedCard.current = true;
          hasResetForm.current = false;
          setImageCaptured(imageCapturedStore);

          let parsedImageUrls: string[] = [];
          if (detail.image_urls) {
            try {
              if (typeof detail.image_urls === 'string') {
                parsedImageUrls = JSON.parse(detail.image_urls);
              } else if (Array.isArray(detail.image_urls)) {
                parsedImageUrls = detail.image_urls;
              }
            } catch (parseError) {
              console.log('Error parsing image_urls:', parseError);
              parsedImageUrls = [];
            }
          }

          setForm({
            title: detail.name ?? '',
            description: detail.description ?? '',
            category_id: detail.category_id?.toString() ?? '',
            start_price: detail.start_price ?? '',
            reserved_price: detail.reserve_price ?? '',
            end_time: detail.end_time ?? '',
            condition: detail.condition ?? CardCondition.RAW,
            listing_type: detail.listing_type ?? ListingType.PORTFOLIO,
            imageUrls: parsedImageUrls,
          });
        }
      } else {
        if (!hasResetForm.current) {
          hasProcessedCard.current = false;
          hasResetForm.current = true;
          setForm(structuredClone(initialSellFormState));
          setImageCaptured(imageCapturedStore);
        }
      }
    }, [
      cardId,
      data?.vw_chaamo_cardsCollection?.edges,
      setForm,
      setImageCaptured,
    ]),
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

  const handleTakeImage = useCallback(async () => {
    setIsCameraOpen(true);
  }, []);

  const handleRemoveImage = useCallback(
    (index: number) => {
      const next = [...form.imageUrls];
      next.splice(index, 1);
      setForm({
        imageUrls: next,
      });
    },
    [form.imageUrls, setForm],
  );

  const handleCreateCard = useCallback(
    async (card: UserCardsInsertInput, listing: ListingsInsertInput) => {
      try {
        const { data: userCardData } = await createUserCard({
          variables: {
            objects: [
              {
                ...card,
                user_id: user?.id,
              },
            ],
          },
        });

        if (userCardData?.insertIntouser_cardsCollection?.records?.length) {
          const userCardId =
            userCardData.insertIntouser_cardsCollection.records[0].id;

          const listingResult = await createListings({
            variables: {
              objects: [
                {
                  ...listing,
                  user_card_id: userCardId,
                },
              ],
            },
          });
          fetch(
            `${process.env.EXPO_PUBLIC_BACKEND_URL}/ebay_scrape?max_pages=1&user_card_id=${userCardId}&region=${user?.profile?.currency === 'GBP' ? 'uk' : 'us'}`,
          ).catch((error) => {
            console.log('eBay scrape error (non-blocking):', error);
          });

          if (
            listingResult.data?.insertIntolistingsCollection?.records?.length
          ) {
            if (form.listing_type === ListingType.PORTFOLIO) {
              setLoading(false);
              Alert.alert('Success!', 'Your portfolio has been saved.', [
                {
                  text: 'OK',
                  onPress: () => {
                    setForm(structuredClone(initialSellFormState));
                    setLoading(false);
                    router.replace('/(tabs)/home');
                  },
                },
              ]);
            } else {
              setForm({
                user_card_id: userCardId,
                listing_id:
                  listingResult.data.insertIntolistingsCollection.records[0].id,
              });
              setLoading(false);
              router.push('/screens/select-ad-package');
            }
          }
          setImageCaptured(imageCapturedStore);
        }
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    },
    [
      createListings,
      createUserCard,
      form.listing_type,
      setForm,
      setImageCaptured,
      user?.id,
      user?.profile?.currency,
    ],
  );

  const handleUpdateCard = useCallback(
    async (card: UserCardsUpdateInput, listing: ListingsUpdateInput) => {
      try {
        const { data: userCardData } = await updateUserCard({
          variables: {
            set: card,
            filter: {
              id: { eq: cardId },
            },
          },
        });

        if (!userCardData?.updateuser_cardsCollection?.records?.length) {
          setLoading(false);
          Alert.alert('Error', 'Failed to update card. Please try again.');
          return;
        }

        const userCardId =
          userCardData.updateuser_cardsCollection.records[0].id;

        try {
          const listingResult = await updateListings({
            variables: {
              set: listing,
              filter: {
                user_card_id: { eq: userCardId },
              },
            },
          });
          fetch(
            `${process.env.EXPO_PUBLIC_BACKEND_URL}/ebay_scrape?max_pages=1&user_card_id=${userCardId}&region=${user?.profile?.currency === 'GBP' ? 'uk' : 'us'}`,
          ).catch((error) => {
            console.log('eBay scrape error (non-blocking):', error);
          });

          if (!listingResult.data?.updatelistingsCollection?.records?.length) {
            setLoading(false);
            Alert.alert(
              'Error',
              'Card updated but failed to update listing. Please try again.',
            );
            return;
          }

          if (form.listing_type === ListingType.PORTFOLIO) {
            setLoading(false);
            Alert.alert('Success!', 'Your portfolio has been updated.', [
              {
                text: 'OK',
                onPress: () => {
                  setForm(structuredClone(initialSellFormState));
                  setLoading(false);
                  router.replace('/(tabs)/home');
                },
              },
            ]);
          } else {
            setForm({
              user_card_id: userCardId,
              listing_id:
                listingResult.data.updatelistingsCollection.records[0].id,
            });
            setLoading(false);
            router.push({
              pathname: '/screens/listing-detail',
              params: {
                id: listingResult.data.updatelistingsCollection.records[0].id,
              },
            });
          }
          setImageCaptured(imageCapturedStore);
        } catch (listingError) {
          setLoading(false);
          console.log('Listing update error:', listingError);
          Alert.alert(
            'Error',
            'Card updated but failed to update listing. Please try again.',
          );
        }
      } catch (error) {
        setLoading(false);
        console.log('Card update error:', error);
        Alert.alert('Error', 'Failed to update card. Please try again.');
      }
    },
    [
      cardId,
      form.listing_type,
      setForm,
      setImageCaptured,
      updateListings,
      updateUserCard,
      user?.profile?.currency,
    ],
  );

  const handleSubmit = useCallback(async () => {
    setLoading(true);
    const requiredFields: (keyof SellFormStore)[] = [
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
      if (!form.imageUrls || form.imageUrls.length === 0) {
        setErrors({ ...validationErrors, imageUrls: 'Image is required' });
        setLoading(false);
        return;
      }

      const uploadedUrlsPromises = form.imageUrls.map((uri) =>
        uploadToBucket(uri, 'chaamo', 'user_cards'),
      );
      const uploadedResults = await Promise.all(uploadedUrlsPromises);
      const uploadedUrls = uploadedResults.filter(
        (u): u is string => typeof u === 'string' && u.length > 0,
      );
      const imageUrls = uploadedUrls.map((u) => String(u));

      const card = {
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
        image_urls: JSON.stringify(imageUrls),
      };

      const listing = {
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
      };

      if (cardId) {
        handleUpdateCard(card, listing);
      } else {
        handleCreateCard(card, listing);
      }
    } else {
      setLoading(false);
    }
  }, [
    form,
    user?.id,
    user?.profile?.currency,
    cardId,
    handleUpdateCard,
    handleCreateCard,
  ]);

  const handleCloseCamera = useCallback(() => {
    setIsCameraOpen(false);
  }, []);

  // don't remove this as it is used to ping the backend to wake it up
  useFocusEffect(
    useCallback(() => {
      (async () => {
        try {
          const purifyBackendUrl = (
            process.env.EXPO_PUBLIC_BACKEND_URL ?? ''
          ).replace('/api/v1', '');
          fetch(`${purifyBackendUrl}/docs`);
        } catch (err: unknown) {
          console.log('Ping error:', (err as Error).message);
        }
      })();
    }, []),
  );

  if (isCameraOpen) {
    return (
      <Camera
        onTakeCallback={handleCloseCamera}
        onBackPress={handleCloseCamera}
      />
    );
  }

  return (
    <ScreenContainer>
      <Header
        title={cardId ? 'Edit Your Card' : 'Sell Your Card'}
        onBackPress={() => router.push('/(tabs)/home')}
      />
      <KeyboardView>
        <View className={classes.container}>
          <View className={classes.imagesContainer}>
            <PhotoUpload onPick={handleTakeImage} loading={loading} />
            {form.imageUrls?.length ? (
              <View className={classes.imageThumbs}>
                {form.imageUrls.map((uri, idx) => (
                  <View
                    key={`${uri}-${idx}`}
                    className={classes.imageThumbWrap}
                  >
                    <Image
                      source={{ uri }}
                      className={classes.imageThumb}
                      contentFit="cover"
                    />
                    <TouchableOpacity
                      className={classes.removeImageBtnSmall}
                      onPress={() => handleRemoveImage(idx)}
                      accessibilityLabel={`remove-image-${idx}`}
                    >
                      <Icon
                        name="close"
                        size={14}
                        color={getColor('gray-600')}
                      />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            ) : null}
          </View>
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
          disabled={
            !isFormValid || (form.imageUrls?.length ?? 0) === 0 || loading
          }
          loading={loading}
        >
          {cardId ? 'Update Your Card' : 'Post Your Card'}
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
          {autocompleteLoading ? (
            <Loading />
          ) : (
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
          )}
        </View>
      </Modal>
    </ScreenContainer>
  );
}

const classes = {
  container: 'flex-1 p-4.5 mb-32 gap-4.5',
  imagesContainer: 'gap-2',
  imageThumbs: 'flex-row flex-wrap gap-2 mb-2',
  imageThumbWrap:
    'relative w-24 aspect-[7/10] rounded-md overflow-hidden bg-white',
  imageThumb: 'w-24 aspect-[7/10]',
  removeImageBtnSmall:
    'absolute top-1 right-1 bg-primary-100 rounded-full w-7 h-7 items-center justify-center z-10 shadow-sm',
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
