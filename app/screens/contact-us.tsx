import { useMemo, useState } from 'react';

import { router } from 'expo-router';
import { Alert, View } from 'react-native';

import {
  Button,
  KeyboardView,
  Label,
  ScreenContainer,
} from '@/components/atoms';
import { Header, TextArea, TextField } from '@/components/molecules';
import { TextChangeParams } from '@/domains';
import { useCreateContactMessagesMutation } from '@/generated/graphql';
import { useUserVar } from '@/hooks/useUserVar';
import { areFieldsEmpty, ValidationValues } from '@/utils/validate';

interface Form extends ValidationValues {
  subject: string;
  message: string;
}

const initialForm: Form = {
  subject: '',
  message: '',
};

export default function ContactUs() {
  const [user] = useUserVar();
  const [form, setForm] = useState<Form>(initialForm);

  const [createContactMessages, { loading }] =
    useCreateContactMessagesMutation();

  const handleChange = ({ name, value }: TextChangeParams) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      await createContactMessages({
        variables: {
          objects: [{ ...form, user_id: user?.id }],
        },
        onCompleted({ insertIntocontact_messagesCollection }) {
          if (insertIntocontact_messagesCollection?.records?.length) {
            Alert.alert('Success', 'Form submitted successfully');
            setForm(initialForm);
            router.back();
          } else {
            Alert.alert('Error', 'Failed to submit form');
          }
        },
      });
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to submit form');
    }
  };

  const disabledForm = useMemo(() => {
    return areFieldsEmpty(form);
  }, [form]);

  return (
    <ScreenContainer>
      <Header title="Contact Us" onBackPress={() => router.back()} />
      <View className={classes.container}>
        <View className={classes.header}>
          <View>
            <Label variant="subtitle" className={classes.label}>
              Contact Us
            </Label>
          </View>
          <Label>
            Complete the form below, or email us, and we will be in touch within
            72 hours
          </Label>
        </View>
        <KeyboardView>
          <TextField
            name="subject"
            value={form.subject}
            onChange={handleChange}
            label="Subject"
          />
          <TextArea
            name="message"
            value={form.message}
            onChange={handleChange}
            label="Message"
            placeholder="Description"
          />
          <View className={classes.emailContainer}>
            <Label variant="title">Or Contact us by email</Label>
            <Label>Email us at support@chaamo.com</Label>
          </View>
        </KeyboardView>
        <Button
          loading={loading}
          className={classes.button}
          onPress={handleSubmit}
          disabled={disabledForm || loading}
        >
          Submit Form
        </Button>
      </View>
    </ScreenContainer>
  );
}

const classes = {
  container: 'flex-1 p-4.5',
  label: 'text-slate-900 text-md',
  header: 'gap-3 mb-10',
  emailContainer: 'mt-5',
  button: 'mb-5',
};
