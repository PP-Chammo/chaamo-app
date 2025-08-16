import { gql } from '@apollo/client';

export const updateConversationParticipants = gql`
  mutation UpdateConversationParticipants(
    $set: conversation_participantsUpdateInput!
    $filter: conversation_participantsFilter
  ) {
    updateconversation_participantsCollection(set: $set, filter: $filter) {
      records {
        conversation_id
      }
    }
  }
`;
