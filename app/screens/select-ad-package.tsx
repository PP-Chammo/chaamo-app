import { useCallback, useMemo } from 'react';

import { Image } from 'expo-image';
import * as Linking from 'expo-linking';
import { router, useLocalSearchParams } from 'expo-router';
import { Alert, View } from 'react-native';

import { Button, Icon, Label, Row, ScreenContainer } from '@/components/atoms';
import { Header, RadioInput } from '@/components/molecules';
import { adFeatures } from '@/constants/adProperties';
import { OrderByDirection, useGetBoostPlansQuery } from '@/generated/graphql';
import { useCurrencyDisplay } from '@/hooks/useCurrencyDisplay';
import { initialSellFormState, useSellFormVar } from '@/hooks/useSellFormVar';
import { useUserVar } from '@/hooks/useUserVar';
import { getColor } from '@/utils/getColor';
import { handlePaypalPayment } from '@/utils/paypal';
import { structuredClone } from '@/utils/structuredClone';

export default function SelectAdPackageScreen() {
  const [user] = useUserVar();
  const [form, setForm] = useSellFormVar();
  const { formatDisplay } = useCurrencyDisplay();
  const { listingId, hideCancelButton, disableBackButton } =
    useLocalSearchParams<{
      [k: string]: string;
    }>();

  const { data } = useGetBoostPlansQuery({
    fetchPolicy: 'cache-and-network',
    variables: {
      orderBy: {
        order: OrderByDirection.ASCNULLSLAST,
      },
    },
  });

  const boostPlans = useMemo(
    () => data?.boost_plansCollection?.edges ?? [],
    [data],
  );

  const handleSelectPackage = useCallback(
    (selectedBoostId: string) => () => {
      setForm({ selectedPackageDays: selectedBoostId });
    },
    [setForm],
  );

  const handleBoostNow = useCallback(async () => {
    if (listingId) {
      const baseUrl = `${process.env.EXPO_PUBLIC_BACKEND_URL}/paypal/boost-post`;
      const redirectUrl = Linking.createURL(
        `screens/listing-detail?id=${listingId}`,
      );
      const startUrl = `${baseUrl}${baseUrl.includes('?') ? '&' : '?'}user_id=${encodeURIComponent(user?.id)}&plan_id=${encodeURIComponent(form?.selectedPackageDays)}&listing_id=${encodeURIComponent(listingId)}&redirect=${encodeURIComponent(redirectUrl)}`;

      try {
        handlePaypalPayment({
          url: startUrl,
          redirectUrl,
          onSuccess: () => {
            router.replace('/screens/checkout-success');
          },
        });
      } catch (e) {
        console.error('Subscription error', e);
        Alert.alert('Payment error', 'Unable to call chaamo boost post.');
      }
    }
  }, [form?.selectedPackageDays, listingId, user?.id]);

  const handleUnboostPackage = useCallback(() => {
    setForm(structuredClone(initialSellFormState));
    router.replace('/(tabs)/home');
  }, [setForm]);

  return (
    <ScreenContainer>
      <Header
        title="Select Ad Package"
        onBackPress={
          disableBackButton === 'true' ? undefined : () => router.back()
        }
      />
      <View className={classes.container}>
        {!listingId && (
          <View className={classes.successMessage}>
            <Icon name="check-circle" color={getColor('green-500')} size={24} />
            <Label className={classes.successMessageText}>
              Your card has been posted successfully
            </Label>
          </View>
        )}
        <View className={classes.content}>
          <View className={classes.cardContainer}>
            <Row between>
              <View className={classes.cardContent}>
                <Label className={classes.cardTitle}>
                  Get your card featured
                </Label>
                {adFeatures.map((feature) => (
                  <Row key={feature} className={classes.rowSubtitle}>
                    <Icon name="check-all" size={18} />
                    <Label className={classes.cardSubtitle}>{feature}</Label>
                  </Row>
                ))}
              </View>
              <Image
                source={require('@/assets/images/E-Wallet-pana.png')}
                className={classes.cardImage}
              />
            </Row>
            <View className={classes.adPackageContainer}>
              {boostPlans.map((boostPlan) => (
                <RadioInput
                  name="adPackage"
                  key={boostPlan.node.name}
                  label={boostPlan.node.name ?? ''}
                  sublabel={formatDisplay(
                    boostPlan.node.currency,
                    boostPlan.node.price,
                  )}
                  selected={form.selectedPackageDays === boostPlan.node.id}
                  onPress={handleSelectPackage(boostPlan.node.id)}
                  className={classes.adPackage}
                  classNameLabel={classes.adPackageText}
                />
              ))}
            </View>
          </View>
        </View>
        <View className={classes.buttonContainer}>
          <Button onPress={handleBoostNow} disabled={!form.selectedPackageDays}>
            Boost Now
          </Button>
          {hideCancelButton !== 'true' && (
            <Button variant="primary-light" onPress={handleUnboostPackage}>
              No, I don&apos;t want to feature now
            </Button>
          )}
        </View>
      </View>
    </ScreenContainer>
  );
}

const classes = {
  container: 'flex-1 gap-4.5',
  content: 'flex-1 px-4.5',
  successMessage:
    'flex flex-row justify-center items-center gap-2 bg-lime-100 px-4.5 py-3',
  successMessageText: 'text-slate-800 text-center font-medium',
  cardContainer: 'bg-primary-100 px-4.5 py-8 rounded-xl',
  cardContent: 'w-[55%]',
  cardTitle: 'text-xl text-primary-500 font-semibold mb-2',
  rowSubtitle: 'gap-2',
  cardSubtitle: 'text-sm mt-1',
  cardImage: 'w-40 h-40 -mr-7',
  buttonContainer: 'gap-5 p-4.5',
  adPackageContainer: 'mt-5 gap-4.5',
  adPackage:
    'flex flex-row justify-between items-center rounded-xl bg-white p-4.5',
  adPackageText: 'font-semibold',
};
