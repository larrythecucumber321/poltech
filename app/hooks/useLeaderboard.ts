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
  query GetLeaderboard($vaultId: String!, $userId: String!) {
    topTen: userVaultDeposits_collection(
      where: { vault_: { id: $vaultId } }
      first: 10
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
    specificUser: userVaultDeposits_collection(
      where: { and: [{ vault_: { id: $vaultId } }, { user: $userId }] }
      first: 1
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
  topTen: LeaderboardEntry[];
  specificUser: LeaderboardEntry[];
}

export function useLeaderboard(vaultId: string) {
  const { address } = useAccount();
  const { data, loading, error } = useQuery<LeaderboardQueryResponse>(
    LEADERBOARD_QUERY,
    {
      variables: { vaultId, userId: address || "" },
      skip: !address,
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
    if (!data) return [];

    const userEntry = data.specificUser[0];
    const otherEntries = data.topTen.filter(
      (entry) => entry.user.toLowerCase() !== address?.toLowerCase()
    );

    return userEntry ? [userEntry, ...otherEntries] : otherEntries;
  }, [data, address]);

  const claimRewards = () => {
    if (address) {
      console.log("Claiming rewards", address);
      writeContract({
        address: VAULT_CONTRACT_ADDRESS,
        abi: vaultABI.abi,
        functionName: "getReward",
        args: [address],
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
