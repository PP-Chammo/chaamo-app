import { gql } from '@apollo/client';

export const createNotifications = gql`
  mutation CreateNotifications($objects: [notificationsInsertInput!]!) {
    insertIntonotificationsCollection(objects: $objects) {
      records {
        id
      }
    }
  }
`;
