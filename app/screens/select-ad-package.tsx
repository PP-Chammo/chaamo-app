import { useCallback } from 'react';

import { router } from 'expo-router';
import { Image, View } from 'react-native';

import { Button, Icon, Label, Row, ScreenContainer } from '@/components/atoms';
import { Header, RadioInput } from '@/components/molecules';
import { adFeatures, adPackages } from '@/constants/adProperties';
import { useUpdateUserCardMutation } from '@/generated/graphql';
import { initialSellFormState, useSellFormVar } from '@/hooks/useSellFormVar';
import { getColor } from '@/utils/getColor';
import { structuredClone } from '@/utils/structuredClone';

export default function SelectAdPackageScreen() {
  const [form, setForm] = useSellFormVar();

  const [updateUserCard] = useUpdateUserCardMutation();

  const handleSelectPackage = useCallback(
    (adPackage: { value: string }) => () => {
      setForm({ selectedPackageDays: adPackage.value });
    },
    [setForm],
  );

  const handleUnboostPackage = useCallback(() => {
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
          setForm(structuredClone(initialSellFormState));
          router.replace('/(tabs)/home');
        }
      },
    });
  }, [form.user_card_id, setForm, updateUserCard]);

  return (
    <ScreenContainer>
      <Header title="Select Ad Package" onBackPress={() => router.back()} />
      <View className={classes.container}>
        <View className={classes.successMessage}>
          <Icon name="check-circle" color={getColor('green-500')} size={24} />
          <Label className={classes.successMessageText}>
            Your card has been posted successfully
          </Label>
        </View>
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
              {adPackages.map((adPackage) => (
                <RadioInput
                  name="adPackage"
                  key={adPackage.label}
                  label={adPackage.label}
                  sublabel={`${adPackage.price[0].currency} ${adPackage.price[0].value}`}
                  selected={form.selectedPackageDays === adPackage.value}
                  onPress={handleSelectPackage(adPackage)}
                  className={classes.adPackage}
                  classNameLabel={classes.adPackageText}
                />
              ))}
            </View>
          </View>
        </View>
        <View className={classes.buttonContainer}>
          <Button
            onPress={() => router.push('/screens/ad-checkout')}
            disabled={!form.selectedPackageDays}
          >
            Proceed to Checkout
          </Button>
          <Button variant="primary-light" onPress={handleUnboostPackage}>
            No, I don&apos;t want to feature now
          </Button>
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
