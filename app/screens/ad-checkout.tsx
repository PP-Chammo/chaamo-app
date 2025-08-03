import { useCallback, useMemo, useState } from 'react';

import { addDays, formatISO } from 'date-fns';
import { router } from 'expo-router';
import { cssInterop } from 'nativewind';
import { Alert, ScrollView, View } from 'react-native';

import { Button, Icon, Label, Row, ScreenContainer } from '@/components/atoms';
import { Header, RadioInput } from '@/components/molecules';
import { adPackages } from '@/constants/adProperties';
import {
  BoostStatus,
  PaymentStatus,
  useCreateBoostedListingsMutation,
  useCreatePaymentsMutation,
  useUpdatePaymentsMutation,
  useUpdateUserCardMutation,
} from '@/generated/graphql';
import { initialSellFormState, useSellFormVar } from '@/hooks/useSellFormVar';
import { useUserVar } from '@/hooks/useUserVar';
import { getColor } from '@/utils/getColor';
import { structuredClone } from '@/utils/structuredClone';

cssInterop(ScrollView, {
  contentContainerClassname: {
    target: 'contentContainerStyle',
  },
});

// this for debug only because we still dont integrate payment system with stripe yet
const hasPaymentMethods = true;

export default function AdCheckoutScreen() {
  const [user] = useUserVar();
  const [form, setForm] = useSellFormVar();

  const [loading, setLoading] = useState(false);

  const [createPayment] = useCreatePaymentsMutation();
  const [createBoostedListing] = useCreateBoostedListingsMutation();
  const [updatePayment] = useUpdatePaymentsMutation();
  const [updateUserCard] = useUpdateUserCardMutation();

  const selectedPackage = useMemo(() => {
    const selected = adPackages.find(
      (adPackage) => adPackage.value === form.selectedPackageDays,
    );
    if (selected) {
      return selected;
    }
    return null;
  }, [form.selectedPackageDays]);

  const handleCheckout = useCallback(() => {
    setLoading(true);
    if (!hasPaymentMethods) {
      router.push('/screens/card-details');
      setLoading(false);
    } else if (form?.listing_id && form?.user_card_id) {
      if (form?.listing_id) {
        createPayment({
          variables: {
            objects: [
              {
                user_id: user.id,
                gateway: 'fake',
                gateway_transaction_id: 'fake_transaction_id',
                status: PaymentStatus.PENDING,
                amount: (selectedPackage?.price[0].value ?? 0).toFixed(2),
              },
            ],
          },
          onCompleted: ({ insertIntopaymentsCollection }) => {
            if (insertIntopaymentsCollection?.records?.length) {
              const newPaymentId = insertIntopaymentsCollection.records[0].id;
              // NOTE: this process createBoostedListing should call after payment success
              createBoostedListing({
                variables: {
                  objects: [
                    {
                      listing_id: form.listing_id,
                      payment_id: newPaymentId,
                      start_time: formatISO(new Date()),
                      end_time: formatISO(
                        addDays(new Date(), Number(form.selectedPackageDays)),
                      ),
                      status: BoostStatus.ACTIVE,
                    },
                  ],
                },
                onCompleted: ({ insertIntoboosted_listingsCollection }) => {
                  if (insertIntoboosted_listingsCollection?.records?.length) {
                    updatePayment({
                      variables: {
                        set: {
                          status: PaymentStatus.SUCCEEDED,
                        },
                        filter: {
                          id: { eq: newPaymentId },
                        },
                      },
                      onCompleted: ({ updatepaymentsCollection }) => {
                        if (updatepaymentsCollection?.records?.length) {
                          updateUserCard({
                            variables: {
                              set: {
                                is_in_listing: true,
                              },
                              filter: {
                                id: { eq: form.user_card_id },
                              },
                            },
                            onCompleted: ({ updateuser_cardsCollection }) => {
                              if (updateuser_cardsCollection?.records?.length) {
                                setLoading(false);
                                Alert.alert(
                                  'Success!',
                                  'Your card has been boosted.',
                                  [
                                    {
                                      text: 'OK',
                                      onPress: () => {
                                        setForm(
                                          structuredClone(initialSellFormState),
                                        );
                                        router.replace('/(tabs)/home');
                                      },
                                    },
                                  ],
                                );
                              }
                            },
                          });
                        }
                      },
                    });
                  }
                },
                onError: (e) => {
                  console.warn('createBoostedListing', e);
                  setLoading(false);
                },
              });
            }
          },
          onError: (e) => {
            console.warn('createPayment', e);
            setLoading(false);
          },
        });
      }
    } else {
      Alert.alert('Missing Posting, please try again.');
    }
  }, [
    createBoostedListing,
    createPayment,
    form.listing_id,
    form.selectedPackageDays,
    form.user_card_id,
    user.id,
    selectedPackage?.price,
    setForm,
    updatePayment,
    updateUserCard,
  ]);

  return (
    <ScreenContainer
      classNameTop={classes.containerTop}
      classNameBottom={classes.containerBottom}
    >
      <Header
        title="Checkout"
        onBackPress={() => router.back()}
        className={classes.header}
      />
      <View className={classes.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerClassName={classes.content}
        >
          <View className={classes.detail}>
            <Label className={classes.detailTitle}>Checkout details</Label>
            <Row between>
              <Label>{selectedPackage?.label}</Label>
              <Label>
                {selectedPackage?.price[0].currency}{' '}
                {selectedPackage?.price[0].value}
              </Label>
            </Row>
          </View>
          <View className={classes.detail}>
            <Label className={classes.detailTitle}>Add Payment Method</Label>
            <RadioInput
              reverse
              label="Debit/Credit Card"
              selected={true}
              name="paymentMethod"
              onPress={() => {}}
            />
          </View>
        </ScrollView>
        <Row center>
          <Icon name="lock-outline" size={18} color={getColor('slate-500')} />
          <Label className={classes.securePaymentText}>
            All payment methods are encrypted and secure
          </Label>
        </Row>
        <View className={classes.buttonContainer}>
          <Row between>
            <Label className={classes.detailTitle}>Total</Label>
            <Label className={classes.detailTitle}>
              {selectedPackage?.price[0].currency}{' '}
              {selectedPackage?.price[0].value}
            </Label>
          </Row>
          <Button
            onPress={handleCheckout}
            disabled={!form.selectedPackageDays || loading}
            loading={loading}
          >
            Checkout
          </Button>
        </View>
      </View>
    </ScreenContainer>
  );
}

const classes = {
  containerTop: 'bg-white',
  containerBottom: 'bg-white',
  header: 'bg-white',
  container: 'flex-1 gap-4.5',
  content: 'flex-1 py-4.5 gap-3',
  detail: 'bg-white gap-4 p-4.5',
  detailTitle: 'text-black font-semibold mb-2',
  buttonContainer: 'bg-white gap-3 p-4.5',
  securePaymentText: 'text-sm !text-slate-600 font-light',
};
