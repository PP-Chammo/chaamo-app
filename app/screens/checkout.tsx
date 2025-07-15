import { useCallback, useState } from 'react';

import { router } from 'expo-router';
import { Image, ScrollView, View } from 'react-native';

import {
  Button,
  Divider,
  Icon,
  Label,
  Row,
  ScreenContainer,
} from '@/components/atoms';
import { Header, RadioInput } from '@/components/molecules';
import { TextChangeParams } from '@/domains';
import { getColor } from '@/utils/getColor';

interface Form {
  insurance: string;
  deliveryOption: string;
}

const initialForm = {
  insurance: '',
  deliveryOption: '',
};

export default function CheckoutScreen() {
  const [form, setForm] = useState<Form>(initialForm);

  const handleChange = useCallback(({ name, value }: TextChangeParams) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handlePay = useCallback(() => {
    router.push('/screens/checkout-success');
  }, []);

  return (
    <ScreenContainer>
      <Header title="Payment" onBackPress={router.back} />
      <ScrollView>
        <View className={classes.container}>
          <View className={classes.imageContainer}>
            <Image
              source={{ uri: 'https://dummyimage.com/600x400/000/fff' }}
              className={classes.image}
              resizeMode="cover"
            />
          </View>
          <View className={classes.section}>
            <Label variant="subtitle">Lamine Yamal</Label>
            <Row between>
              <Label>Offer</Label>
              <Label>$ 1,282</Label>
            </Row>
            <Row between>
              <Label>Delivery Fee</Label>
              <Label>$ 50</Label>
            </Row>
            <Divider position="horizontal" className={classes.divider} />
            <Row between>
              <Label variant="subtitle">Total</Label>
              <Label>$ 1,332</Label>
            </Row>
          </View>
          <View className={classes.section}>
            <Label variant="subtitle">Insurance (Optional)</Label>
            <RadioInput
              reverse
              name="insurance"
              label="Protect your purchase with optional insurance. This is not required, and you can choose to proceed without it. If selected, the insurance cost will be added to your total and calculated at checkout."
              keyLabel="insurance"
              selected={form.insurance === 'insurance'}
              onPress={handleChange}
            />
          </View>
          <View className={classes.section}>
            <Label variant="subtitle">Address</Label>
            <Label>House # 209 fleet road</Label>
          </View>
          <View className={classes.section}>
            <Label variant="subtitle">Delivery Option</Label>
            <RadioInput
              reverse
              name="deliveryOption"
              label="Ship to pickup point"
              selected={form.deliveryOption === 'Ship to pickup point'}
              onPress={handleChange}
            />
            <RadioInput
              reverse
              name="deliveryOption"
              label="Ship to home"
              selected={form.deliveryOption === 'Ship to home'}
              onPress={handleChange}
            />
          </View>

          <View className={classes.section}>
            <Row between>
              <Label variant="subtitle">Delivery Details</Label>
              <Icon
                name="pencil-outline"
                size={24}
                color={getColor('slate-500')}
              />
            </Row>
            <Label>House # 209 fleet road</Label>
          </View>

          <Row center>
            <Icon name="lock-outline" size={24} color={getColor('slate-500')} />
            <Label className={classes.securePayment}>
              This is a secure encrypted payment
            </Label>
          </Row>
          <Button className={classes.buttonPay} onPress={handlePay}>
            Pay $1332
          </Button>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const classes = {
  imageContainer: 'bg-white justify-center items-center self-center py-8 px-10',
  image: 'w-32 h-48',
  section: 'bg-white p-4.5 gap-4',
  container: 'gap-4',
  divider: '!bg-primary-100 my-2',
  buttonPay: 'mb-12 mx-4.5',
  securePayment: 'text-slate-500',
};
