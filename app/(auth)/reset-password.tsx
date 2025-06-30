import { useState } from 'react';

import { router } from 'expo-router';
import { Text, View } from 'react-native';

import { Button, Label, ScreenContainer } from '@/components/atoms';
import { Header, TextField } from '@/components/molecules';
import { TextChangeParams } from '@/domains';

interface ResetPasswordForm {
  newPassword: string;
  confirmNewPassword: string;
}

export default function ResetPasswordScreen() {
  const [form, setForm] = useState<ResetPasswordForm>({
    newPassword: '',
    confirmNewPassword: '',
  });
  const [errorText, setErrorText] = useState<string>('');

  const handleChange = ({ name, value }: TextChangeParams) => {
    setErrorText('');
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleReset = () => {
    if (form.newPassword !== form.confirmNewPassword)
      return setErrorText('Passwords do not match. Please try again.');
    return router.push('/(tabs)/home');
  };

  return (
    <ScreenContainer className="p-6">
      <Header title="New Password" />
      <View className={classes.form}>
        <Label className={classes.title} variant="title">
          Reset Your Password
        </Label>
        <Label className={classes.description}>
          Enter your new password below.
        </Label>
        <View className={classes.inputContainer}>
          <TextField
            label="New Password"
            placeholder="Enter New password"
            value={form.newPassword}
            onChange={handleChange}
            name="newPassword"
            type="password"
            required
          />
          <TextField
            label="Confirm New Password"
            placeholder="Enter Confirm New password"
            value={form.confirmNewPassword}
            onChange={handleChange}
            name="confirmNewPassword"
            type="password"
            required
          />
        </View>
        {errorText && <Text className={classes.errorText}>{errorText}</Text>}
        <Button
          disabled={!form.newPassword || !form.confirmNewPassword}
          onPress={handleReset}
          className={classes.loginButton}
        >
          Save New Password
        </Button>
      </View>
    </ScreenContainer>
  );
}

const classes = {
  form: 'flex-1 mt-[50] gap-3',
  inputContainer: 'gap-6',
  title: 'text-3xl font-bold text-teal-600',
  description: 'text-slate-500 font-medium text-lg mb-6',
  loginButton: 'my-2 ',
  errorText: 'text-red-500 text-sm',
};
