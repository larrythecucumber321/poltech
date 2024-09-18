import { gql } from "graphql-request";

export const LEADERBOARD_QUERY = gql`
  query GetLeaderboard($first: Int!, $vaultId: String!) {
    userVaultDeposits_collection(
      where: { vault_: { id: $vaultId } }
      first: $first
      orderBy: amount
      orderDirection: desc
    ) {
      id
      user
      amount
      vault {
        id
        vaultAddress
      }
    }
  }
`;
