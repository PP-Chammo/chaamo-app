import { gql } from '@apollo/client';

export const getBoostPlans = gql`
  query GetBoostPlans {
    boost_plansCollection {
      edges {
        node {
          id
          paypal_plan_id
          name
          currency
          price
          boost_days
        }
      }
    }
  }
`;
