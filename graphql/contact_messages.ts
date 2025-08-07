import { gql } from '@apollo/client';

export const createContactMessages = gql`
  mutation CreateContactMessages($objects: [contact_messagesInsertInput!]!) {
    insertIntocontact_messagesCollection(objects: $objects) {
      records {
        id
      }
    }
  }
`;
