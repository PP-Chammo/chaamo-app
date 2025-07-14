import React from 'react';

import { StripeIcon } from '@/assets/svg';
import { CardField, KeyboardView, Row } from '@/components/atoms';
import { TextField } from '@/components/molecules';
import { TextChangeParams } from '@/domains';
import { ValidationErrors, ValidationValues } from '@/utils/validate';

interface Form extends ValidationValues {
  cardNumber: string;
  expiry: string;
  cvc: string;
}

interface PaymentFormProps {
  form: Form;
  errors: ValidationErrors<Form>;
  onChange: ({ name, value }: TextChangeParams) => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({
  form,
  errors,
  onChange,
}) => {
  return (
    <KeyboardView
      className={classes.keyboardView}
      contentContainerClassName={classes.contentContainer}
    >
      <StripeIcon />
      <CardField
        id="card-number"
        name="cardNumber"
        label="Card Number"
        value={form.cardNumber}
        onChange={onChange}
        placeholder="2424 2424 2424 2424"
        required
        error={errors['cardNumber']}
      />
      <Row className={classes.row}>
        <TextField
          name="expiry"
          label="Expiry"
          onChange={onChange}
          value={form.expiry}
          placeholder="mm/yy"
          keyboardType="numeric"
          maxLength={5}
          required
          className={classes.input}
          type="date"
          error={errors['expiry']}
        />
        <TextField
          name="cvc"
          label="CVC"
          onChange={onChange}
          value={form.cvc}
          placeholder="123"
          keyboardType="numeric"
          maxLength={3}
          required
          className={classes.input}
          error={errors['cvc']}
        />
      </Row>
    </KeyboardView>
  );
};

const classes = {
  keyboardView: 'flex-1 mt-8',
  contentContainer: 'gap-6',
  input: 'flex-1',
  row: 'gap-4',
};

export default PaymentForm;
