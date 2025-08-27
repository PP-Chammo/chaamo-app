import { gql } from '@apollo/client';

export const getMembershipPlans = gql`
  query GetMembershipPlans {
    membership_plansCollection {
      edges {
        node {
          id
          type
          name
          description
          currency
          price
          benefits
          subscription_days
        }
      }
    }
  }
`;
