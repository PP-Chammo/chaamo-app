import { gql } from '@apollo/client';

export const getFnOrCreateConversation = gql`
  mutation FnGetOrCreateConversation($partner_id: UUID!) {
    fn_get_or_create_conversation(partner_id: $partner_id) {
      conversation_id
      username
      profile_image_url
    }
  }
`;
