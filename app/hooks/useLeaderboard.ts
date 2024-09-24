"use client";

import { gql, useQuery } from "@apollo/client";
import {
  useAccount,
  useContractRead,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { useMemo } from "react";
import { VAULT_CONTRACT_ADDRESS } from "@/lib/constants";
import vaultABI from "@/lib/abi/Vault.json";

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
  const { address } = useAccount();
  const { data, loading, error } = useQuery<LeaderboardQueryResponse>(
    LEADERBOARD_QUERY,
    {
      variables: { vaultId, first: limit },
    }
  );

  const { data: earnedRewards } = useContractRead({
    address: VAULT_CONTRACT_ADDRESS,
    abi: vaultABI.abi,
    functionName: "earned",
    args: [address],
  });

  const { writeContract, data: hash } = useWriteContract();
  const { isLoading: isClaimingRewards, isSuccess: isClaimConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  const sortedLeaderboard = useMemo(() => {
    if (!data?.userVaultDeposits_collection) return [];

    const userEntry = data.userVaultDeposits_collection.find(
      (entry) => entry.user.toLowerCase() === address?.toLowerCase()
    );
    const otherEntries = data.userVaultDeposits_collection.filter(
      (entry) => entry.user.toLowerCase() !== address?.toLowerCase()
    );

    return userEntry ? [userEntry, ...otherEntries] : otherEntries;
  }, [data, address]);

  const claimRewards = () => {
    if (address) {
      writeContract({
        address: VAULT_CONTRACT_ADDRESS,
        abi: vaultABI.abi,
        functionName: "getReward",
        args: [address, address],
      });
    }
  };

  return {
    leaderboard: sortedLeaderboard,
    loading,
    error,
    earnedRewards,
    claimRewards,
    isClaimingRewards,
    isClaimConfirmed,
  };
}
