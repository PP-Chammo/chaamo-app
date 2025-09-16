import React, {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { formatISO, parse } from 'date-fns';
import { Image } from 'expo-image';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { startCase, toLower } from 'lodash';
import { cssInterop } from 'nativewind';
import { Alert, FlatList, View, TouchableOpacity } from 'react-native';

import { Button, KeyboardView, ScreenContainer } from '@/components/atoms';
import Icon from '@/components/atoms/Icon';
import {
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
  CardsInsertInput,
  CardsUpdateInput,
  ListingsInsertInput,
  ListingsUpdateInput,
  ListingType,
  useCreateCardMutation,
  useCreateListingsMutation,
  useGetCategoriesQuery,
  useGetVwListingCardDetailLazyQuery,
  useUpdateCardMutation,
  useUpdateListingsMutation,
} from '@/generated/graphql';
import { useImageCapturedVar } from '@/hooks/useImageCapturedVar';
import { initialSellFormState, useSellFormVar } from '@/hooks/useSellFormVar';
import { useUserVar } from '@/hooks/useUserVar';
import { imageCapturedStore } from '@/stores/imageCapturedStore';
import { SellFormStore } from '@/stores/sellFormStore';
import { SupportedCurrency } from '@/types/currency';
import { getColor } from '@/utils/getColor';
import {
  parseCanonicalTitle,
  parseTitleCardYear,
} from '@/utils/parseTitleCard';
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

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors<SellFormStore>>({});

  const { data: categoriesData } = useGetCategoriesQuery();

  const [createCard] = useCreateCardMutation();
  const [createListing] = useCreateListingsMutation();

  const [getDetail] = useGetVwListingCardDetailLazyQuery();
  const [updateCard] = useUpdateCardMutation();
  const [updateListing] = useUpdateListingsMutation();

  // const hasProcessedCard = useRef(false);
  // const hasResetForm = useRef(false);

  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [imageCaptured, setImageCaptured] = useImageCapturedVar();

  const userCurrencySymbol = useMemo(() => {
    if (!user) return '$';
    const currency = user.profile?.currency;
    return currencySymbolMap[currency as SupportedCurrency];
  }, [user]);

  const categories = useMemo(() => {
    const list = categoriesData?.categoriesCollection?.edges ?? [];
    return list.map((category) => ({
      value: String(category?.node.id),
      label: category?.node.name,
    }));
  }, [categoriesData?.categoriesCollection?.edges]);

  const requiredFields = useMemo<(keyof SellFormStore)[]>(() => {
    const fields: (keyof SellFormStore)[] = [
      'cardYears',
      'cardCategoryId',
      'cardSet',
      'cardName',
      'cardNumber',
      'cardCondition',
      ...(form.cardCondition === CardCondition.GRADED
        ? (['cardGradingCompany', 'cardGradeNumber'] as const)
        : []),
      'description',
      'listingType',
      ...(form.listingType === 'sell' ? (['startPrice'] as const) : []),
      ...(form.listingType === 'auction'
        ? (['endTime', 'startPrice', 'reservedPrice'] as const)
        : []),
    ];
    return fields;
  }, [form.cardCondition, form.listingType]);

  const isFormValid = useMemo(
    () =>
      requiredFields.every(
        (field) => form[field] && form[field].toString().trim() !== '',
      ),
    [form, requiredFields],
  );

  const handleBack = useCallback(() => {
    if (cardId) {
      router.back();
      setForm(structuredClone(initialSellFormState));
    } else {
      router.push('/(tabs)/home');
      setForm(structuredClone(initialSellFormState));
    }
  }, [cardId, setForm]);

  const handleChange = useCallback(
    ({ name, value }: { name: string; value: string }) => {
      setForm({ [name]: value });
    },
    [setForm],
  );

  const handleOpenCamera = useCallback(async () => {
    setIsCameraOpen(true);
  }, []);

  const handleCloseCamera = useCallback(() => {
    setIsCameraOpen(false);
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

  const fnCreateListing = useCallback(
    async (cardId: string, listing: ListingsInsertInput) => {
      try {
        const { data: listingData } = await createListing({
          variables: {
            objects: [
              {
                ...listing,
                card_id: cardId,
              },
            ],
          },
        });
        const ebayScrapeUrl = `ebay_scrape`;
        const ebayScrapeParams = `?max_pages=1&card_id=${cardId}&region=${user?.profile?.currency === 'GBP' ? 'uk' : 'us'}`;
        await fetch(
          `${process.env.EXPO_PUBLIC_BACKEND_URL}/${ebayScrapeUrl}${ebayScrapeParams}`,
        );
        if (listingData?.insertIntolistingsCollection?.records?.length) {
          if (form.listingType === ListingType.PORTFOLIO) {
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
              cardId: cardId,
              listingId: listingData.insertIntolistingsCollection.records[0].id,
            });
            setLoading(false);
            router.push('/screens/select-ad-package');
          }
        }
      } catch (e: unknown) {
        setLoading(false);
        console.log('createListing failed:', e);
      }
    },
    [createListing, form.listingType, setForm, user?.profile?.currency],
  );

  const fnCreatePost = useCallback(
    async (card: CardsInsertInput, listing: ListingsInsertInput) => {
      try {
        const { data: cardData } = await createCard({
          variables: {
            objects: [
              {
                ...card,
                user_id: user?.id,
              },
            ],
          },
        });
        if (cardData?.insertIntocardsCollection?.records?.length) {
          const cardId = cardData.insertIntocardsCollection.records[0].id;
          fnCreateListing(cardId, listing);
          setImageCaptured(imageCapturedStore);
        }
      } catch (e: unknown) {
        setLoading(false);
        console.log('createCard failed:', e);
        Alert.alert(
          'Error',
          'Card created but failed to create listing. Please try again.',
        );
      }
    },
    [createCard, fnCreateListing, setImageCaptured, user?.id],
  );

  const fnUpdateListing = useCallback(
    async (cardId: string, listing: ListingsInsertInput) => {
      try {
        const { data: listingData } = await updateListing({
          variables: {
            set: listing,
            filter: {
              card_id: { eq: cardId },
            },
          },
        });
        const ebayScrapeUrl = `ebay_scrape`;
        const ebayScrapeParams = `?max_pages=1&card_id=${cardId}&region=${user?.profile?.currency === 'GBP' ? 'uk' : 'us'}`;
        await fetch(
          `${process.env.EXPO_PUBLIC_BACKEND_URL}/${ebayScrapeUrl}${ebayScrapeParams}`,
        );
        if (listingData?.updatelistingsCollection?.records?.length) {
          if (form.listingType === ListingType.PORTFOLIO) {
            setLoading(false);
            Alert.alert('Success!', 'Your portfolio has been updated.', [
              {
                text: 'OK',
                onPress: () => {
                  setLoading(false);
                  router.back();
                },
              },
            ]);
          } else {
            setForm({
              cardId: cardId,
              listingId: listingData.updatelistingsCollection.records[0].id,
            });
            setLoading(false);
            router.back();
          }
        }
      } catch (e: unknown) {
        setLoading(false);
        console.log('Listing update error:', e);
        Alert.alert(
          'Error',
          'Card updated but failed to update listing. Please try again.',
        );
      }
    },
    [form.listingType, setForm, updateListing, user?.profile?.currency],
  );

  const fnUpdatePost = useCallback(
    async (card: CardsUpdateInput, listing: ListingsUpdateInput) => {
      try {
        const { data: cardData } = await updateCard({
          variables: {
            set: card,
            filter: {
              id: { eq: cardId },
            },
          },
        });
        if (cardData?.updatecardsCollection?.records?.length) {
          const cardId = cardData.updatecardsCollection.records[0].id;
          fnUpdateListing(cardId, listing);
        } else {
          setLoading(false);
          Alert.alert('Error', 'Failed to update card. Please try again.');
          return;
        }
      } catch (e: unknown) {
        setLoading(false);
        console.log('updateCard failed:', e);
      }
    },
    [cardId, fnUpdateListing, updateCard],
  );

  const handleSubmit = useCallback(async () => {
    setLoading(true);
    const validationErrors = validateRequired(
      form as unknown as Record<string, string | number>,
      requiredFields,
    );
    setErrors(validationErrors);

    if (!form.imageUrls || form.imageUrls.length === 0) {
      setLoading(false);
      return;
    }

    if (Object.keys(validationErrors).length === 0) {
      const uploadedImageResults = await Promise.all(
        form.imageUrls.map((uri) =>
          uploadToBucket(uri, 'chaamo', 'user_cards'),
        ),
      );
      const uploadedUrls = uploadedImageResults.filter(
        (u): u is string => typeof u === 'string' && u.length > 0,
      );
      const imageUrls = uploadedUrls.map((u) => String(u));
      const cardPayload = {
        image_urls: JSON.stringify(imageUrls),
        years: JSON.stringify(parseTitleCardYear(form.cardYears)),
        category_id: Number(form.cardCategoryId),
        card_set: startCase(toLower(form.cardSet.trim())),
        name: startCase(toLower(form.cardName.trim())),
        serial_number: `/${(form.cardSerialNumber ?? '').trim()}`,
        number: `#${form.cardNumber.trim()}`,
        condition: form.cardCondition,
        grading_company: form.cardGradingCompany.trim(),
        grade_number: form.cardGradeNumber.trim(),
        description: form.description.trim(),
        canonical_title: parseCanonicalTitle(form),
      };
      const listingPayload = {
        seller_id: user.id,
        listing_type: form.listingType,
        currency: user?.profile?.currency,
        // Sell
        ...(form.listingType === ListingType.SELL
          ? {
              start_price: Number(form.startPrice).toFixed(2),
            }
          : {}),
        // Auction
        ...(form.listingType === ListingType.AUCTION
          ? {
              start_price: Number(form.startPrice).toFixed(2),
              reserve_price: Number(form.reservedPrice).toFixed(2),
              start_time: formatISO(new Date()),
              end_time: formatISO(
                parse(form.endTime, 'dd/MM/yyyy', new Date()),
              ),
            }
          : {}),
      };
      if (cardId) {
        fnUpdatePost(cardPayload, listingPayload);
      } else {
        fnCreatePost(cardPayload, listingPayload);
      }
    } else {
      setLoading(false);
    }
  }, [
    form,
    requiredFields,
    user.id,
    user?.profile?.currency,
    cardId,
    fnUpdatePost,
    fnCreatePost,
  ]);

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
      if (cardId) {
        (async () => {
          const detail = await getDetail({
            variables: {
              filter: { card_id: { eq: cardId } },
            },
          });
          const listingDetail =
            detail?.data?.vw_listing_cardsCollection?.edges?.[0]?.node;
          if (listingDetail) {
            const cardYears =
              JSON.parse(listingDetail.years || [])?.join('-') ?? '';
            setForm({
              imageUrls: listingDetail.image_urls
                ? JSON.parse(listingDetail.image_urls)
                : [],
              cardCategoryId: listingDetail.category_id?.toString() ?? '',
              cardYears,
              cardSet: listingDetail.card_set ?? '',
              cardName: listingDetail.name ?? '',
              cardSerialNumber:
                listingDetail.serial_number?.replace(/^\//g, '') ?? '',
              cardNumber: listingDetail.number?.replace(/^#/g, '') ?? '',
              cardCondition: listingDetail.condition ?? CardCondition.RAW,
              cardGradingCompany: listingDetail.grading_company ?? '',
              cardGradeNumber: listingDetail.grade_number ?? '',
              description: listingDetail.description ?? '',
              startPrice: listingDetail.start_price ?? '',
              reservedPrice: listingDetail.reserve_price ?? '',
              endTime: listingDetail.end_time ?? '',
              listingType: listingDetail.listing_type ?? ListingType.PORTFOLIO,
            });
          }
        })();
      } else {
        setForm(structuredClone(initialSellFormState));
      }
      // keep this to avoid infinite loop
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cardId, getDetail]),
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
        onBackPress={handleBack}
      />
      <KeyboardView>
        <View className={classes.container}>
          <View className={classes.imagesContainer}>
            <PhotoUpload onPick={handleOpenCamera} loading={loading} />
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
          <Select
            name="cardCategoryId"
            label="Category"
            required
            placeholder="Select Category"
            value={form.cardCategoryId}
            onChange={handleChange}
            options={categories}
            inputClassName={classes.input}
            error={errors.cardCategoryId}
          />
          <TextField
            name="cardYears"
            label="Year(s)"
            placeholder="E.g: 2020 or 2020-21 or 2020-2021"
            value={form.cardYears}
            onChange={handleChange}
            required
            inputClassName={classes.input}
            error={errors.cardYears}
          />
          <TextField
            name="cardSet"
            label="Brand & Set"
            placeholder="E.g: Topps Chrome"
            value={form.cardSet}
            onChange={handleChange}
            required
            inputClassName={classes.input}
            error={errors.cardSet}
          />
          <TextField
            name="cardName"
            label="Character / Player"
            placeholder="E.g: Lamine Yamal"
            value={form.cardName}
            onChange={handleChange}
            required
            inputClassName={classes.input}
            error={errors.cardName}
          />
          <TextField
            name="cardSerialNumber"
            label="Serial Number / Numbered"
            placeholder='E.g: 50 (automatically add prefix "/")'
            value={form.cardSerialNumber}
            onChange={handleChange}
            leftLabel="/"
            inputClassName={classes.input}
            error={errors.cardSerialNumber}
          />
          <TextField
            name="cardNumber"
            label="Number"
            placeholder='E.g: 31 (automatically add prefix "#")'
            value={form.cardNumber}
            onChange={handleChange}
            leftLabel="#"
            required
            inputClassName={classes.input}
            error={errors.cardNumber}
          />
          <Select
            name="cardCondition"
            label="Condition"
            required
            placeholder="Select Card Condition"
            value={form.cardCondition}
            onChange={handleChange}
            options={conditions}
            inputClassName={classes.input}
            error={errors.cardCondition}
          />
          {form.cardCondition === CardCondition.GRADED && (
            <Fragment>
              <TextField
                name="cardGradingCompany"
                label="Grading Company"
                placeholder="E.g: PSA"
                value={form.cardGradingCompany.toUpperCase()}
                onChange={(e) =>
                  handleChange({
                    name: 'cardGradingCompany',
                    value: e.value.toUpperCase(),
                  })
                }
                required
                inputClassName={classes.input}
                error={errors.cardGradingCompany}
              />
              <TextField
                name="cardGradeNumber"
                label="Grade Number"
                placeholder="E.g: 10/10 or 10"
                value={form.cardGradeNumber}
                keyboardType="numeric"
                onChange={handleChange}
                required
                inputClassName={classes.input}
                error={errors.cardGradeNumber}
              />
            </Fragment>
          )}
          <TextArea
            name="description"
            label="Description"
            placeholder="Description about the card"
            value={form.description}
            onChange={handleChange}
            required
            inputClassName={classes.input}
            error={errors.description}
          />
          <Select
            name="listingType"
            label="Listing Type"
            required
            disabled={!!cardId}
            placeholder="Select Listing Type"
            value={form.listingType}
            onChange={handleChange}
            options={conditionSells}
            inputClassName={classes.input}
            error={errors.listingType}
          />
          {form.listingType === 'sell' && (
            <TextField
              name="startPrice"
              label="Price"
              placeholder="Enter price"
              value={form.startPrice}
              onChange={handleChange}
              keyboardType="numeric"
              required
              inputClassName={classes.input}
              leftLabel={userCurrencySymbol}
              error={errors.startPrice}
            />
          )}
          {form.listingType === 'auction' && (
            <Fragment>
              <TextField
                type="date"
                name="endTime"
                label="Auction End Date"
                value={form.endTime}
                onChange={handleChange}
                required
                inputClassName={classes.input}
                rightIcon="calendar"
                rightIconVariant="SimpleLineIcons"
                rightIconSize={20}
                rightIconColor={getColor('slate-500')}
                error={errors.endTime}
              />
              <TextField
                name="startPrice"
                label="Minimum Price"
                value={form.startPrice}
                onChange={handleChange}
                keyboardType="numeric"
                required
                inputClassName={classes.input}
                leftLabel={userCurrencySymbol}
                error={errors.startPrice}
              />
              <TextField
                name="reservedPrice"
                label="Reserved Price"
                value={form.reservedPrice}
                onChange={handleChange}
                keyboardType="numeric"
                required
                inputClassName={classes.input}
                leftLabel={userCurrencySymbol}
                error={errors.reservedPrice}
              />
            </Fragment>
          )}
        </View>
      </KeyboardView>
      <View className={classes.buttonContainer}>
        <Button
          onPress={handleSubmit}
          disabled={!isFormValid || form.imageUrls?.length === 0 || loading}
          loading={loading}
        >
          {cardId ? 'Update Your Card' : 'Post Your Card'}
        </Button>
      </View>
    </ScreenContainer>
  );
}

const classes = {
  container: 'flex-1 p-4.5 mb-32 gap-4.5',
  imagesContainer: 'gap-2',
  imageThumbs: 'flex-row flex-wrap gap-2 mt-2',
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
