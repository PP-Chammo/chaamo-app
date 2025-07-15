import { useCallback, useState } from 'react';

import { router } from 'expo-router';
import { View } from 'react-native';

import { PaymentSuccessIcon } from '@/assets/svg';
import { Button, Label, Modal, ScreenContainer } from '@/components/atoms';
import { Header, Rating, TextArea } from '@/components/molecules';

export default function CheckoutSuccessScreen() {
  const [review, setReview] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleModal = useCallback(() => {
    setIsModalVisible(!isModalVisible);
  }, [isModalVisible]);

  return (
    <ScreenContainer>
      <Header onBackPress={() => router.back()} />
      <View className={classes.container}>
        <PaymentSuccessIcon />
        <Label className={classes.title} variant="title">
          Congratulations
        </Label>
        <Label className={classes.description}>
          Your purchase has been completed.
        </Label>
        <View className={classes.buttonContainer}>
          <Button onPress={handleModal}>Write a Review</Button>
          <Button
            onPress={() => router.push('/(tabs)/home')}
            variant="primary-light"
          >
            Go to Home
          </Button>
        </View>
      </View>

      <Modal
        className={classes.modal}
        visible={isModalVisible}
        onClose={handleModal}
      >
        <Label className={classes.modalTitle}>How is your experience?</Label>
        <Label className={classes.modalDescription}>
          Please take a moment to rate & review.
        </Label>
        <Rating className={classes.rating} value={0} size={28} />
        <TextArea
          inputClassName={classes.textArea}
          placeholder="Write your review"
          name="review"
          onChange={({ value }) => setReview(value)}
        />
        <Button disabled={!review.length} className={classes.submitButton}>
          Submit
        </Button>
      </Modal>
    </ScreenContainer>
  );
}

const classes = {
  container: 'flex-1 items-center px-4.5',
  buttonContainer: 'w-full gap-5 mt-10',
  title: 'mt-5 !text-primary-600',
  description: 'mt-2.5 !text-slate-500',
  modal: 'items-center p-10',
  modalTitle: 'mt-5 text-slate-800 text-xl font-semibold',
  modalDescription: 'mt-2.5 !text-slate-500',
  rating: 'my-5',
  textArea: 'w-full',
  submitButton: 'mt-5 w-full',
};
