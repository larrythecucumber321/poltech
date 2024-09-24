"use client";

import { gql, useQuery } from "@apollo/client";

type LeaderboardEntry = {
  id: string;
  user: string;
  amount: string;
  vault: {
    id: string;
    vaultAddress: string;
  };
};

const LEADERBOARD_QUERY = gql`
  query GetLeaderboard($vaultId: String!, $first: Int!) {
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

interface LeaderboardQueryResponse {
  userVaultDeposits_collection: LeaderboardEntry[];
}

export function useLeaderboard(vaultId: string, limit: number = 10) {
  const { data, loading, error } = useQuery<LeaderboardQueryResponse>(
    LEADERBOARD_QUERY,
    {
      variables: { vaultId, first: limit },
    }
  );

  return {
    leaderboard: data?.userVaultDeposits_collection ?? [],
    loading,
    error,
  };
}
