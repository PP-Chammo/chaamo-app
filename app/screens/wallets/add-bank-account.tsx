import { useState } from 'react';

import { router } from 'expo-router';
import { View } from 'react-native';

import { Button, Label, ScreenContainer } from '@/components/atoms';
import { Header, TextField } from '@/components/molecules';
import { TextChangeParams } from '@/domains';
import {
  validateRequired,
  ValidationErrors,
  ValidationValues,
} from '@/utils/validate';

interface Form extends ValidationValues {
  accountName: string;
  accountNumber: string;
  confirmAccountNumber: string;
}

export default function AddBankAccountScreen() {
  const [form, setForm] = useState<Form>({
    accountName: '',
    accountNumber: '',
    confirmAccountNumber: '',
  });

  const [errors, setErrors] = useState<ValidationErrors<Form>>({});

  const handleChange = ({ name, value }: TextChangeParams) => {
    setErrors((prev) => {
      delete prev[name as keyof typeof prev];
      return prev;
    });

    setForm({ ...form, [name]: value });
  };

  const handleSubmit = () => {
    const errors = validateRequired<Form>(form, [
      'accountName',
      'accountNumber',
      'confirmAccountNumber',
    ]);
    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return;
    }
    // TODO: Implement API call to add bank account
    router.replace('/screens/wallets');
  };

  return (
    <ScreenContainer>
      <Header title="Add A Bank Account" onBackPress={() => router.back()} />
      <View className={classes.container}>
        <Label className={classes.title}>
          Incorrect information can mean a delay in receiving funds.
        </Label>
        <View className={classes.form}>
          <TextField
            label="Account Holder Name"
            placeholder="Enter your account holder name"
            value={form.accountName}
            onChange={handleChange}
            name="accountName"
            required
            error={errors.accountName}
          />
          <TextField
            label="Account Number"
            placeholder="Enter your account number"
            value={form.accountNumber}
            onChange={handleChange}
            name="accountNumber"
            required
            error={errors.accountNumber}
          />
          <TextField
            label="Confirm Account Number"
            placeholder="Enter your account number"
            value={form.confirmAccountNumber}
            onChange={handleChange}
            name="confirmAccountNumber"
            required
            error={errors.confirmAccountNumber}
          />
          <Label className={classes.terms}>
            By adding this bank account you are confirming that you are the
            owner and have full authorization to this bank account.
          </Label>
        </View>

        <View className={classes.buttonContainer}>
          <Button
            className={classes.button}
            variant="light"
            onPress={() => router.replace('/screens/wallets')}
          >
            Cancel
          </Button>
          <Button className={classes.button} onPress={handleSubmit}>
            Add Bank Account
          </Button>
        </View>
      </View>
    </ScreenContainer>
  );
}

const classes = {
  container: 'flex-1 p-4.5',
  title: 'text-slate-500',
  form: 'flex-1 gap-4 mt-5',
  terms: 'text-slate-500',
  buttonContainer: 'flex-row gap-4 justify-between my-4.5',
  button: 'flex-1',
};
