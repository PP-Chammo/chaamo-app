import { useCallback, useMemo, useState } from 'react';

import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { Alert, View } from 'react-native';

import {
  Button,
  KeyboardView,
  Label,
  ScreenContainer,
} from '@/components/atoms';
import { Header, TextArea, TextField } from '@/components/molecules';
import { TextChangeParams } from '@/domains';
import {
  useCreateContactMessagesMutation,
  useGetVwChaamoDetailLazyQuery,
} from '@/generated/graphql';
import { useUserVar } from '@/hooks/useUserVar';
import { sendEmail } from '@/utils/email';
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
  const { listingId } = useLocalSearchParams();
  const [form, setForm] = useState<Form>(initialForm);
  const [recipient, setRecipient] = useState('support@chaamo.com');

  const [getListingDetail, { data: listingDetail }] =
    useGetVwChaamoDetailLazyQuery({
      fetchPolicy: 'cache-and-network',
    });
  const [createContactMessages, { loading }] =
    useCreateContactMessagesMutation();

  const handleChange = ({ name, value }: TextChangeParams) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const userCardId = listingDetail?.vw_chaamo_cardsCollection?.edges?.length
        ? listingDetail?.vw_chaamo_cardsCollection.edges[0].node.user_card_id
        : null;
      await createContactMessages({
        variables: {
          objects: [
            {
              ...form,
              user_id: user?.id,
              ...(listingId && userCardId
                ? {
                    user_card_id: userCardId,
                  }
                : {}),
            },
          ],
        },
        onCompleted({ insertIntocontact_messagesCollection }) {
          if (insertIntocontact_messagesCollection?.records?.length) {
            if (listingId && userCardId) {
              sendEmail({
                to: recipient,
                subject: form.subject,
                html: `<p>${form.message}</p>`,
              });
              Alert.alert('Sent', 'Form sent to support team');
            } else {
              Alert.alert('Success', 'Form submitted successfully');
              setForm(initialForm);
              router.back();
            }
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

  useFocusEffect(
    useCallback(() => {
      (async () => {
        try {
          if (listingId) {
            const { data: vwChaamoCardsCollection } = await getListingDetail({
              variables: {
                filter: {
                  id: { eq: listingId },
                },
              },
            });
            const detailEdges =
              vwChaamoCardsCollection?.vw_chaamo_cardsCollection?.edges;

            if (detailEdges?.length) {
              setForm({
                user_card_id: user?.id,
                subject: `I have a question about last sold price`,
                message: `I have a question about the price value for "${detailEdges[0].node.name}".`,
              });
              setRecipient('technicalsupport@chaamo.com');
            }
          }
        } catch (e) {
          console.error('Failed to fetch listing detail', e);
          Alert.alert('Error', 'Failed to fetch listing detail');
        }
      })();
    }, [listingId, getListingDetail, user?.id]),
  );

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
            <Label>Email us at {recipient}</Label>
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
