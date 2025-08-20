import { gql } from '@apollo/client';

// Current schema uses type_id. When backend adds `notification_type` enum,
// we can introduce a new mutation variant or update codegen accordingly.
export const createNotifications = gql`
  mutation CreateNotifications($objects: [notificationsInsertInput!]!) {
    insertIntonotificationsCollection(objects: $objects) {
      records {
        id
      }
    }
  }
`;
