import { useState } from 'react';

import { router } from 'expo-router';
import { View } from 'react-native';

import {
  Button,
  KeyboardView,
  Label,
  ScreenContainer,
} from '@/components/atoms';
import { Header, TextArea, TextField } from '@/components/molecules';
import { TextChangeParams } from '@/domains';

interface Form {
  subject: string;
  message: string;
}

const initialForm: Form = {
  subject: '',
  message: '',
};

export default function ContactUs() {
  const [form, setForm] = useState<Form>(initialForm);

  const handleChange = ({ name, value }: TextChangeParams) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };
  return (
    <ScreenContainer>
      <Header title="Contact Us" onBackPress={() => router.back()} />
      <View className={classes.container}>
        <View className={classes.header}>
          <View>
            <Label>🖐</Label>
            <Label variant="subtitle" className={classes.label}>
              If you’ve anything for us to discuss with any issue please let us
              know
            </Label>
          </View>
          <Label>
            Please fill the details below and click on submit form button to
            send us your query or you can email us as well
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
            <Label>Email us at hello@chaamo.com</Label>
          </View>
        </KeyboardView>
        <Button className={classes.button}>Submit Form</Button>
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
