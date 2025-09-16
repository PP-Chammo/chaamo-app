import { useCallback, useMemo, useState } from 'react';

import { Decimal } from 'decimal.js';
import * as Linking from 'expo-linking';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { Alert, ScrollView, TouchableOpacity, View } from 'react-native';

import {
  Button,
  Divider,
  Icon,
  Label,
  Row,
  ScreenContainer,
} from '@/components/atoms';
import {
  Header,
  ImageGallery,
  RadioInput,
  Select,
} from '@/components/molecules';
import { TextChangeParams } from '@/domains';
import { useGetVwListingCardDetailQuery } from '@/generated/graphql';
import { useCurrencyDisplay } from '@/hooks/useCurrencyDisplay';
import { useUserVar } from '@/hooks/useUserVar';
import { fetcher } from '@/utils/fetcher';
import { getColor } from '@/utils/getColor';
import { handlePaypalPayment } from '@/utils/paypal';

Decimal.set({ precision: 28, rounding: Decimal.ROUND_HALF_EVEN });

interface Form {
  deliveryRateId: string | null;
  insurance: string;
}

type DeliveryRateResponse = {
  shipment_id: string;
  rates: DeliveryRate[];
};

type DeliveryRate = {
  id: string;
  value: string;
  label: string;
  shippo_rate_id: string;
  amount: number;
  courier: string;
  currency: string;
  estimated_days: number;
  service: string;
};

type DeliveryRateOption = {
  value: string;
  label: string;
  currency: string;
  amount: number;
};

type OrderResponse = {
  status?: string;
  paypal_order_id?: string;
  paypal_checkout_url?: string;
};

type ParamList = {
  id: string;
  isDirectBuy: string;
};

const initialForm = {
  deliveryRateId: null,
  insurance: '',
};

export default function CheckoutScreen() {
  const [user] = useUserVar();
  const { formatDisplay, formatPrice } = useCurrencyDisplay();
  const { id, isDirectBuy } = useLocalSearchParams<ParamList>();

  const [form, setForm] = useState<Form>(initialForm);
  const [deliveryLoading, setDeliveryLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deliveryRateList, setDeliveryRateList] = useState<
    DeliveryRateOption[]
  >([]);

  const { data } = useGetVwListingCardDetailQuery({
    variables: {
      filter: {
        id: { eq: id },
      },
    },
  });

  const detail = useMemo(() => {
    return data?.vw_listing_cardsCollection?.edges?.[0]?.node;
  }, [data]);

  const selectedRate = useMemo(() => {
    if (deliveryRateList.length === 0) return null;
    return deliveryRateList.find((rate) => rate.value === form.deliveryRateId);
  }, [deliveryRateList, form.deliveryRateId]);

  const selectedItemPrice = useMemo(() => {
    if (detail?.listing_type === 'auction') {
      return Number(detail?.highest_bid_price) > 0
        ? detail?.highest_bid_price
        : detail?.start_price;
    }
    return detail?.start_price;
  }, [detail]);

  const insuranceAmount = useMemo(() => {
    if (form.insurance !== 'insurance') return 0;
    return new Decimal(selectedItemPrice ?? 0).mul(0.01).toNumber();
  }, [form.insurance, selectedItemPrice]);

  const total = useMemo(() => {
    const ratePrice = formatPrice(selectedRate?.currency, selectedRate?.amount);
    return Number(selectedItemPrice) + Number(ratePrice) + insuranceAmount;
  }, [
    formatPrice,
    selectedRate?.currency,
    selectedRate?.amount,
    selectedItemPrice,
    insuranceAmount,
  ]);

  const handleChange = useCallback(({ name, value }: TextChangeParams) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handlePay = useCallback(async () => {
    try {
      setLoading(true);
      const isUseInsurance = form.insurance === 'insurance';
      const response = (await fetcher.post('/paypal/order', {
        listing_id: detail?.id,
        buyer_id: user?.id,
        selected_rate_id: form.deliveryRateId,
        selected_rate_amount: selectedRate?.amount,
        selected_rate_currency: selectedRate?.currency,
        insurance: isUseInsurance,
        insurance_currency: user?.profile?.currency,
        insurance_amount: insuranceAmount,
        redirect: Linking.createURL('screens/checkout-success'),
      })) as OrderResponse;
      if (response?.paypal_order_id && response?.paypal_checkout_url) {
        handlePaypalPayment({
          url: response.paypal_checkout_url,
          redirectUrl: Linking.createURL('screens/checkout'),
          onSuccess: () => {
            setLoading(false);
          },
          onCancel: (isBack) => {
            setLoading(false);
            if (isBack) {
              router.back();
            }
          },
        });
      } else {
        if (!!response?.status) {
          Alert.alert('Payment failed', 'This card already sold.');
          setLoading(false);
          router.back();
        }
      }
    } catch (e: unknown) {
      setLoading(false);
      console.error('handlePay error', e);
    }
  }, [
    detail?.id,
    form.deliveryRateId,
    form.insurance,
    insuranceAmount,
    selectedRate?.amount,
    selectedRate?.currency,
    user?.id,
    user?.profile?.currency,
  ]);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        try {
          setDeliveryLoading(true);
          const response = (await fetcher.get('/shippo/rates', {
            seller_id: detail?.seller_id,
            buyer_id: user?.id,
            insurance: form.insurance === 'insurance',
            insurance_amount: 10,
          })) as DeliveryRateResponse;
          if (response) {
            const deliveryRateList = (response.rates as DeliveryRate[]).map(
              (res: DeliveryRate) => ({
                value: res.id,
                label: `${formatDisplay(res.currency, res.amount)} - ${res.service}`,
                currency: res.currency,
                amount: res.amount,
              }),
            );
            setDeliveryRateList(deliveryRateList);
          }
          setDeliveryLoading(false);
        } catch (error: unknown) {
          setDeliveryLoading(false);
          const rawMessage = (error as Error)?.message;
          const message = rawMessage?.includes('{')
            ? JSON.parse(rawMessage.match(/{.*}/)?.[0] ?? '{}')?.detail
            : rawMessage;
          Alert.alert('Failed get shipper', message ?? '');
          console.error(error);
        }
      })();
      /* keep this empty dependency array to prevent infinite loop */
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );

  return (
    <ScreenContainer>
      <Header title="Payment" onBackPress={router.back} />
      <ScrollView>
        <View className={classes.container}>
          <View className={classes.imageContainer}>
            <ImageGallery
              imageUrls={detail?.image_urls}
              imageClassName={classes.image}
              showIndicators={true}
            />
          </View>
          <View className={classes.section}>
            <Label variant="subtitle">{detail?.name}</Label>
            <Row between>
              <Label>{isDirectBuy === 'true' ? 'Price' : 'Offer'}</Label>
              <Label>
                {formatDisplay(detail?.currency, detail?.start_price)}
              </Label>
            </Row>
            <Row between className={classes.row}>
              <Label>Shipper</Label>
              <View className={classes.selectContainer}>
                <Select
                  name="deliveryRateId"
                  required
                  placeholder={
                    deliveryRateList.length === 0
                      ? deliveryLoading
                        ? 'Loading...'
                        : 'Check address, delivery unavailable'
                      : 'Select Delivery'
                  }
                  value={form.deliveryRateId || ''}
                  onChange={handleChange}
                  options={deliveryRateList}
                  inputClassName={classes.input}
                  disabled={deliveryRateList.length === 0}
                />
              </View>
            </Row>
            <Divider position="horizontal" className={classes.divider} />
            <Row between>
              <Label variant="subtitle">Total</Label>
              <Label>{formatDisplay(user?.profile?.currency, total)}</Label>
            </Row>
          </View>
          <View className={classes.section}>
            <Label variant="subtitle">Insurance (Optional)</Label>
            <RadioInput
              reverse
              toggle
              name="insurance"
              label="Protect your purchase with optional insurance. This is not required, and you can choose to proceed without it. If selected, the insurance cost will be added to your total and calculated at checkout."
              keyLabel="insurance"
              value={form.insurance}
              selected={form.insurance === 'insurance'}
              onPress={handleChange}
            />
          </View>

          <View className={classes.section}>
            <Row between>
              <Label variant="subtitle">Delivery Details</Label>
              <TouchableOpacity
                onPress={() => router.push('/screens/personal-details')}
              >
                <Icon
                  name="pencil-outline"
                  size={24}
                  color={getColor('slate-500')}
                />
              </TouchableOpacity>
            </Row>
            <View>
              <Label>
                {user?.profile?.username} / {user?.profile?.phone_number}
              </Label>
              <Label>{user?.profile?.address_line_1}</Label>
              <Label>
                {user?.profile?.country}, {user?.profile?.city + ','}{' '}
                {user?.profile?.country === 'GB'
                  ? ''
                  : user?.profile?.state_province}{' '}
                {user?.profile?.postal_code}
              </Label>
            </View>
          </View>

          <Row center>
            <Icon name="lock-outline" size={24} color={getColor('slate-500')} />
            <Label className={classes.securePayment}>
              This is a secure encrypted payment
            </Label>
          </Row>
          <Button
            className={classes.buttonPay}
            onPress={handlePay}
            disabled={
              !form.deliveryRateId || form.deliveryRateId === null || loading
            }
            loading={loading}
          >
            Pay {formatDisplay(user?.profile?.currency, total)}
          </Button>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const classes = {
  imageContainer: 'bg-white justify-center items-center self-center py-8 px-10',
  image:
    'w-56 aspect-[7/10] rounded-xl border border-gray-200 bg-gray-200 items-center justify-center',
  section: 'bg-white p-4.5 gap-4',
  container: 'gap-4',
  divider: '!bg-primary-100 my-2',
  buttonPay: 'mb-12 mx-4.5',
  securePayment: 'text-slate-500',
  row: 'gap-5',
  input: 'bg-white leading-5 w-full',
  selectContainer: 'flex-1',
};
