import { gql } from '@apollo/client';

export const getConversationParticipants = gql`
  query GetConversationParticipants(
    $filter: conversation_participantsFilter
    $last: Int
    $first: Int
  ) {
    conversation_participantsCollection(
      filter: $filter
      last: $last
      first: $first
    ) {
      edges {
        node {
          conversation_id
          profiles {
            id
            username
            profile_image_url
          }
        }
      }
    }
  }
`;

export const createConversationParticipants = gql`
  mutation CreateConversationParticipants(
    $objects: [conversation_participantsInsertInput!]!
  ) {
    insertIntoconversation_participantsCollection(objects: $objects) {
      records {
        conversation_id
        profiles {
          id
          username
          profile_image_url
        }
      }
    }
  }
`;
